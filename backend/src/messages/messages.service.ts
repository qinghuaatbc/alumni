import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private repo: Repository<Message>,
  ) {}

  async send(fromId: number, toId: number, content: string) {
    const msg = this.repo.create({ fromId, toId, content });
    const saved = await this.repo.save(msg);
    return this.repo.findOne({ where: { id: saved.id }, relations: ['from', 'to'] });
  }

  async getConversations(userId: number) {
    // Get all messages involving this user, group by the other person
    const msgs = await this.repo.find({
      where: [{ fromId: userId }, { toId: userId }],
      relations: ['from', 'to'],
      order: { createdAt: 'DESC' },
    });

    const convMap = new Map<number, any>();
    for (const m of msgs) {
      const otherId = m.fromId === userId ? m.toId : m.fromId;
      const other = m.fromId === userId ? m.to : m.from;
      if (!convMap.has(otherId)) {
        const unread = msgs.filter(
          (x) => x.fromId === otherId && x.toId === userId && !x.isRead,
        ).length;
        convMap.set(otherId, { user: other, lastMessage: m, unread });
      }
    }
    return Array.from(convMap.values());
  }

  async getConversation(userId: number, otherId: number) {
    const msgs = await this.repo.find({
      where: [
        { fromId: userId, toId: otherId },
        { fromId: otherId, toId: userId },
      ],
      relations: ['from', 'to'],
      order: { createdAt: 'ASC' },
    });

    // Mark all incoming as read
    const unread = msgs.filter((m) => m.toId === userId && !m.isRead);
    if (unread.length) {
      await this.repo.update(unread.map((m) => m.id), { isRead: true });
    }
    return msgs;
  }

  async getUnreadCount(userId: number) {
    return this.repo.count({ where: { toId: userId, isRead: false } });
  }
}
