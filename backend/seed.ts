import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './users/user.entity';
import { AlumniProfile } from './alumni/alumni-profile.entity';

const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: './alumni.db',
  entities: [User, AlumniProfile],
  synchronize: false,
});

const demoUsers = [
  {
    username: 'zhangwei',
    email: 'zhangwei@example.com',
    password: '123456',
    role: UserRole.ADMIN,
    profile: {
      name: '张伟',
      gender: '男',
      birthday: '1995-03-15',
      school: '北京大学',
      className: '计算机科学2013级1班',
      studentId: '2013010001',
      enrollYear: 2013,
      graduationYear: 2017,
      phone: '13800138001',
      email: 'zhangwei@example.com',
      wechat: 'zhangwei_wx',
      city: '北京',
      company: '字节跳动',
      profession: '高级软件工程师',
      avatar: 'https://i.pravatar.cc/150?img=11',
      bio: '热爱技术，专注于分布式系统和云原生架构。业余时间喜欢爬山和摄影。',
    },
  },
  {
    username: 'liuna',
    email: 'liuna@example.com',
    password: '123456',
    role: UserRole.MEMBER,
    profile: {
      name: '李娜',
      gender: '女',
      birthday: '1995-07-22',
      school: '北京大学',
      className: '计算机科学2013级1班',
      studentId: '2013010002',
      enrollYear: 2013,
      graduationYear: 2017,
      phone: '13800138002',
      email: 'liuna@example.com',
      wechat: 'liuna_wx',
      city: '上海',
      company: '阿里巴巴',
      profession: '产品经理',
      avatar: 'https://i.pravatar.cc/150?img=47',
      bio: '从技术转型到产品，专注用户体验设计。喜欢旅行、阅读和烹饪。',
    },
  },
  {
    username: 'wangfang',
    email: 'wangfang@example.com',
    password: '123456',
    role: UserRole.MEMBER,
    profile: {
      name: '王芳',
      gender: '女',
      birthday: '1994-11-08',
      school: '北京大学',
      className: '计算机科学2013级2班',
      studentId: '2013010023',
      enrollYear: 2013,
      graduationYear: 2017,
      phone: '13800138003',
      email: 'wangfang@example.com',
      wechat: 'wangfang_wx',
      city: '深圳',
      company: '腾讯',
      profession: 'UI设计师',
      avatar: 'https://i.pravatar.cc/150?img=45',
      bio: '用设计改变世界。擅长移动端交互设计，热爱插画创作。',
    },
  },
  {
    username: 'chengang',
    email: 'chengang@example.com',
    password: '123456',
    role: UserRole.MEMBER,
    profile: {
      name: '陈刚',
      gender: '男',
      birthday: '1995-01-30',
      school: '北京大学',
      className: '计算机科学2013级2班',
      studentId: '2013010024',
      enrollYear: 2013,
      graduationYear: 2017,
      phone: '13800138004',
      email: 'chengang@example.com',
      wechat: 'chengang_wx',
      city: '杭州',
      company: '蚂蚁集团',
      profession: '数据科学家',
      avatar: 'https://i.pravatar.cc/150?img=12',
      bio: '痴迷于数据挖掘和机器学习，相信数据驱动决策。业余爱好：篮球、象棋。',
    },
  },
  {
    username: 'zhaoxiao',
    email: 'zhaoxiao@example.com',
    password: '123456',
    role: UserRole.MEMBER,
    profile: {
      name: '赵晓',
      gender: '女',
      birthday: '1996-05-12',
      school: '北京大学',
      className: '软件工程2014级1班',
      studentId: '2014020015',
      enrollYear: 2014,
      graduationYear: 2018,
      phone: '13800138005',
      email: 'zhaoxiao@example.com',
      wechat: 'zhaoxiao_wx',
      city: '广州',
      company: '网易',
      profession: '前端开发工程师',
      avatar: 'https://i.pravatar.cc/150?img=44',
      bio: '专注React和Vue生态，喜欢探索Web新技术。热爱音乐和舞蹈。',
    },
  },
  {
    username: 'sunhao',
    email: 'sunhao@example.com',
    password: '123456',
    role: UserRole.MEMBER,
    profile: {
      name: '孙浩',
      gender: '男',
      birthday: '1994-09-20',
      school: '北京大学',
      className: '软件工程2014级1班',
      studentId: '2014020016',
      enrollYear: 2014,
      graduationYear: 2018,
      phone: '13800138006',
      email: 'sunhao@example.com',
      wechat: 'sunhao_wx',
      city: '成都',
      company: '华为',
      profession: '嵌入式工程师',
      avatar: 'https://i.pravatar.cc/150?img=15',
      bio: '深耕嵌入式和IoT领域，对硬件和软件结合充满热情。爱好：骑行、徒步。',
    },
  },
  {
    username: 'zhoumin',
    email: 'zhoumin@example.com',
    password: '123456',
    role: UserRole.MEMBER,
    profile: {
      name: '周敏',
      gender: '女',
      birthday: '1995-04-03',
      school: '北京大学',
      className: '信息安全2013级1班',
      studentId: '2013030008',
      enrollYear: 2013,
      graduationYear: 2017,
      phone: '13800138007',
      email: 'zhoumin@example.com',
      wechat: 'zhoumin_wx',
      city: '北京',
      company: '360安全',
      profession: '安全研究员',
      avatar: 'https://i.pravatar.cc/150?img=49',
      bio: '从事网络安全研究，专注漏洞挖掘和渗透测试。喜欢CTF比赛和密码学。',
    },
  },
  {
    username: 'wuyang',
    email: 'wuyang@example.com',
    password: '123456',
    role: UserRole.MEMBER,
    profile: {
      name: '吴阳',
      gender: '男',
      birthday: '1993-12-25',
      school: '北京大学',
      className: '信息安全2013级1班',
      studentId: '2013030009',
      enrollYear: 2013,
      graduationYear: 2017,
      phone: '13800138008',
      email: 'wuyang@example.com',
      wechat: 'wuyang_wx',
      city: '上海',
      company: '商汤科技',
      profession: 'AI研究员',
      avatar: 'https://i.pravatar.cc/150?img=18',
      bio: '专注计算机视觉和深度学习，有多篇顶会论文。业余喜欢下围棋。',
    },
  },
  {
    username: 'liuyang',
    email: 'liuyang@example.com',
    password: '123456',
    role: UserRole.MEMBER,
    profile: {
      name: '刘洋',
      gender: '男',
      birthday: '1996-08-14',
      school: '北京大学',
      className: '软件工程2014级2班',
      studentId: '2014020031',
      enrollYear: 2014,
      graduationYear: 2018,
      phone: '13800138009',
      email: 'liuyang@example.com',
      wechat: 'liuyang_wx',
      city: '武汉',
      company: '小米',
      profession: '后端工程师',
      avatar: 'https://i.pravatar.cc/150?img=20',
      bio: '擅长Java和Go后端开发，对高并发系统设计有深入研究。喜欢开源贡献。',
    },
  },
  {
    username: 'huangmei',
    email: 'huangmei@example.com',
    password: '123456',
    role: UserRole.MEMBER,
    profile: {
      name: '黄梅',
      gender: '女',
      birthday: '1995-02-28',
      school: '北京大学',
      className: '软件工程2014级2班',
      studentId: '2014020032',
      enrollYear: 2014,
      graduationYear: 2018,
      phone: '13800138010',
      email: 'huangmei@example.com',
      wechat: 'huangmei_wx',
      city: '南京',
      company: '途牛旅游',
      profession: '全栈工程师',
      avatar: 'https://i.pravatar.cc/150?img=41',
      bio: '热爱全栈开发，从数据库到前端一手包办。业余爱好是摄影和旅行。',
    },
  },
];

async function seed() {
  await AppDataSource.initialize();
  console.log('Connected to database');

  const userRepo = AppDataSource.getRepository(User);
  const profileRepo = AppDataSource.getRepository(AlumniProfile);

  let created = 0;
  let skipped = 0;

  for (const data of demoUsers) {
    const existing = await userRepo.findOne({ where: { username: data.username } });
    if (existing) {
      console.log(`⏭  Skipping ${data.profile.name} (already exists)`);
      skipped++;
      continue;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = userRepo.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });
    const savedUser = await userRepo.save(user);

    const profile = profileRepo.create({
      userId: savedUser.id,
      ...data.profile,
    });
    await profileRepo.save(profile);

    console.log(`✅ Created ${data.profile.name} (${data.profile.city} · ${data.profile.company})`);
    created++;
  }

  console.log(`\nDone! Created ${created}, skipped ${skipped}.`);
  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
