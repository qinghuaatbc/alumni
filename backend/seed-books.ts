import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { AlumniProfile } from './alumni/alumni-profile.entity';
import { Book } from './library/book.entity';
import { Comment } from './comments/comment.entity';
import { Message } from './messages/message.entity';
import { Photo } from './photos/photo.entity';

const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: './alumni.db',
  entities: [User, AlumniProfile, Book, Comment, Message, Photo],
  synchronize: false,
});

const books = [
  // 技术
  { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', category: '技术', cover: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg', publishYear: 2008, publisher: 'Prentice Hall', totalCopies: 3, description: '《代码整洁之道》是软件工程领域最经典的著作之一，讲述如何编写可读性高、易于维护的代码。', readUrl: 'https://archive.org/details/cleancode0000mart', downloadUrl: undefined },
  { title: '深入理解计算机系统', author: 'Randal E. Bryant', isbn: '9787111321330', category: '技术', cover: 'https://covers.openlibrary.org/b/isbn/9780134092669-L.jpg', publishYear: 2016, publisher: '机械工业出版社', totalCopies: 2, description: 'CSAPP，计算机科学经典教材，从程序员的视角深入理解计算机系统的运作原理。', readUrl: 'https://csapp.cs.cmu.edu/', downloadUrl: undefined },
  { title: '算法导论', author: 'Thomas H. Cormen', isbn: '9787111407010', category: '技术', cover: 'https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg', publishYear: 2012, publisher: '机械工业出版社', totalCopies: 2, description: '算法领域的权威教材，涵盖从基础算法到高级数据结构的全面内容。', readUrl: 'https://archive.org/details/introductiontoal00corm', downloadUrl: undefined },
  { title: 'JavaScript高级程序设计', author: 'Nicholas C. Zakas', isbn: '9787115275790', category: '技术', cover: 'https://covers.openlibrary.org/b/isbn/9780764579wants-L.jpg', publishYear: 2020, publisher: '人民邮电出版社', totalCopies: 2, description: '前端开发必读经典，全面讲解JavaScript语言特性、DOM编程与前端最佳实践。', readUrl: null, downloadUrl: undefined },
  // 文学
  { title: '三体', author: '刘慈欣', isbn: '9787536692930', category: '文学', cover: 'https://covers.openlibrary.org/b/isbn/9787536692930-L.jpg', publishYear: 2008, publisher: '重庆出版社', totalCopies: 3, description: '中国科幻小说的里程碑之作，讲述人类文明与外星文明的第一次接触，荣获雨果奖。', readUrl: null, downloadUrl: undefined },
  { title: '百年孤独', author: '加西亚·马尔克斯', isbn: '9787544253994', category: '文学', cover: 'https://covers.openlibrary.org/b/isbn/9787544253994-L.jpg', publishYear: 2011, publisher: '南海出版公司', totalCopies: 2, description: '魔幻现实主义的巅峰之作，诺贝尔文学奖作品，讲述布恩迪亚家族七代人的传奇故事。', readUrl: 'https://archive.org/details/onehundredyearso00marc', downloadUrl: undefined },
  { title: '活着', author: '余华', isbn: '9787506365437', category: '文学', cover: 'https://covers.openlibrary.org/b/isbn/9787506365437-L.jpg', publishYear: 2012, publisher: '作家出版社', totalCopies: 3, description: '余华最具代表性的作品，以平静的笔触讲述了一个人历经沧桑、坚韧活着的故事。', readUrl: null, downloadUrl: undefined },
  { title: '平凡的世界', author: '路遥', isbn: '9787530210291', category: '文学', cover: 'https://picsum.photos/seed/pingfan/200/300', publishYear: 2005, publisher: '北京十月文艺出版社', totalCopies: 2, description: '茅盾文学奖获奖作品，描写中国西北农村普通人的命运与奋斗，感动了无数读者。', readUrl: null, downloadUrl: undefined },
  // 历史
  { title: '人类简史', author: '尤瓦尔·赫拉利', isbn: '9787508660752', category: '历史', cover: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg', publishYear: 2014, publisher: '中信出版社', totalCopies: 3, description: '从认知革命到人工智能，以全新视角讲述人类从猿人到主宰地球的演化历程，全球畅销。', readUrl: 'https://archive.org/details/sapiensabriefhis0000hara', downloadUrl: undefined },
  { title: '明朝那些事儿', author: '当年明月', isbn: '9787802068742', category: '历史', cover: 'https://picsum.photos/seed/mingchao/200/300', publishYear: 2009, publisher: '中国海关出版社', totalCopies: 2, description: '以通俗幽默的语言讲述明朝近三百年历史，让历史不再枯燥，成为网络文学的经典之作。', readUrl: null, downloadUrl: undefined },
  // 经济
  { title: '经济学原理', author: 'N. Gregory Mankiw', isbn: '9787302274575', category: '经济', cover: 'https://covers.openlibrary.org/b/isbn/9780538453059-L.jpg', publishYear: 2015, publisher: '清华大学出版社', totalCopies: 2, description: '全球最受欢迎的经济学入门教材，以生动的案例和清晰的逻辑介绍微观与宏观经济学。', readUrl: 'https://archive.org/details/principlesofmacr0000mank', downloadUrl: undefined },
  { title: '穷爸爸富爸爸', author: '罗伯特·清崎', isbn: '9787550258860', category: '经济', cover: 'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg', publishYear: 2018, publisher: '南海出版公司', totalCopies: 3, description: '财富观念的启蒙经典，通过两个父亲的故事讲述富人与穷人对待金钱的不同思维方式。', readUrl: 'https://archive.org/details/richdadpoordadwh0000kiya', downloadUrl: undefined },
  { title: '黑天鹅', author: '纳西姆·塔勒布', isbn: '9787508622538', category: '经济', cover: 'https://covers.openlibrary.org/b/isbn/9781400063512-L.jpg', publishYear: 2011, publisher: '中信出版社', totalCopies: 2, description: '探讨不可预测的重大事件对人类历史和经济的影响，提出"黑天鹅"理论，改变认知方式。', readUrl: 'https://archive.org/details/blackswanimpactof00tale', downloadUrl: undefined },
  // 哲学
  { title: '苏菲的世界', author: '乔斯坦·贾德', isbn: '9787020042333', category: '哲学', cover: 'https://covers.openlibrary.org/b/isbn/9781857993820-L.jpg', publishYear: 2015, publisher: '作家出版社', totalCopies: 2, description: '一部关于西方哲学史的小说，通过一个少女探索哲学奥秘的故事，带你走进哲学的世界。', readUrl: 'https://archive.org/details/sophiesworld00gaar', downloadUrl: undefined },
  { title: '论语', author: '孔子', isbn: '9787101003048', category: '哲学', cover: 'https://picsum.photos/seed/lunyu/200/300', publishYear: 2008, publisher: '中华书局', totalCopies: 3, description: '儒家思想的核心经典，记录孔子及其弟子的言行，影响中华文明两千余年。', readUrl: 'https://ctext.org/analects/zh', downloadUrl: 'https://www.gutenberg.org/ebooks/4094' },
];

const samplePhotos = [
  { albumName: '2017届毕业典礼', className: '计算机科学2013级1班', url: 'https://picsum.photos/seed/grad1/800/600', caption: '毕业典礼合影', takenAt: '2017-06-20' },
  { albumName: '2017届毕业典礼', className: '计算机科学2013级1班', url: 'https://picsum.photos/seed/grad2/800/600', caption: '学位授予仪式', takenAt: '2017-06-20' },
  { albumName: '2017届毕业典礼', className: '计算机科学2013级2班', url: 'https://picsum.photos/seed/grad3/800/600', caption: '班级最后合影', takenAt: '2017-06-21' },
  { albumName: '2018届毕业典礼', className: '软件工程2014级1班', url: 'https://picsum.photos/seed/grad4/800/600', caption: '毕业合照留念', takenAt: '2018-06-22' },
  { albumName: '2018届毕业典礼', className: '软件工程2014级2班', url: 'https://picsum.photos/seed/grad5/800/600', caption: '同学情谊永在', takenAt: '2018-06-22' },
  { albumName: '校园生活', className: '计算机科学2013级1班', url: 'https://picsum.photos/seed/campus1/800/600', caption: '图书馆备考', takenAt: '2016-05-10' },
  { albumName: '校园生活', className: '计算机科学2013级2班', url: 'https://picsum.photos/seed/campus2/800/600', caption: '宿舍聚餐', takenAt: '2015-10-15' },
  { albumName: '校园生活', className: '软件工程2014级1班', url: 'https://picsum.photos/seed/campus3/800/600', caption: '运动会', takenAt: '2016-11-05' },
  { albumName: '同学聚会2023', className: '', url: 'https://picsum.photos/seed/reunion1/800/600', caption: '北京同学聚会', takenAt: '2023-08-15' },
  { albumName: '同学聚会2023', className: '', url: 'https://picsum.photos/seed/reunion2/800/600', caption: '上海小聚', takenAt: '2023-09-20' },
  { albumName: '同学聚会2023', className: '', url: 'https://picsum.photos/seed/reunion3/800/600', caption: '深圳欢聚', takenAt: '2023-11-01' },
];

async function seed() {
  await AppDataSource.initialize();
  console.log('Connected to database');

  const bookRepo = AppDataSource.getRepository(Book);
  const photoRepo = AppDataSource.getRepository(Photo);
  const userRepo = AppDataSource.getRepository(User);

  // Seed books (upsert by title)
  let booksCreated = 0;
  for (const b of books) {
    const exists = await bookRepo.findOne({ where: { title: b.title } });
    const { totalCopies, ...rest } = b;
    if (exists) {
      await bookRepo.save({ ...exists, ...rest });
      console.log(`🔄 Updated: ${b.title}`);
    } else {
      await bookRepo.save(bookRepo.create({ ...rest, totalCopies, availableCopies: totalCopies }));
      console.log(`📚 Book: ${b.title}`);
      booksCreated++;
    }
  }

  // Seed photos (assigned to first user)
  const firstUser = await userRepo.findOne({ where: {} });
  if (firstUser) {
    let photosCreated = 0;
    for (const p of samplePhotos) {
      const exists = await photoRepo.findOne({ where: { url: p.url } });
      if (!exists) {
        await photoRepo.save(photoRepo.create({ uploaderId: firstUser.id, ...p }));
        photosCreated++;
      }
    }
    console.log(`📷 Photos: ${photosCreated} created`);
  }

  console.log(`\nDone! Books: ${booksCreated}`);
  await AppDataSource.destroy();
}

seed().catch((e) => { console.error(e); process.exit(1); });
