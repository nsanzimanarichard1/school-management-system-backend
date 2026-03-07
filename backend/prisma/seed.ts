import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/hash';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@gmail.com',
      passwordHash: hashPassword('admin123'),
      role: 'ADMIN',
      devices: {
        create: {
          deviceId: 'admin-device',
          verified: true
        }
      }
    }
  });
  console.log('✅ Super Admin created:', superAdmin.email);

  // Create Sample Subjects
  const mathSubject = await prisma.subject.upsert({
    where: { code: 'MATH101' },
    update: {},
    create: {
      name: 'Mathematics',
      code: 'MATH101'
    }
  });

  const physicsSubject = await prisma.subject.upsert({
    where: { code: 'PHY101' },
    update: {},
    create: {
      name: 'Physics',
      code: 'PHY101'
    }
  });

  const englishSubject = await prisma.subject.upsert({
    where: { code: 'ENG101' },
    update: {},
    create: {
      name: 'English',
      code: 'ENG101'
    }
  });
  console.log('✅ Subjects created: Math, Physics, English');

  // Create Sample Teacher
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@school.com' },
    update: {},
    create: {
      name: 'John Smith',
      email: 'teacher@school.com',
      passwordHash: hashPassword('teacher123'),
      role: 'TEACHER',
      devices: {
        create: {
          deviceId: 'teacher-device',
          verified: true
        }
      }
    }
  });

  const teacher = await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      userId: teacherUser.id
    }
  });
  console.log('✅ Teacher created:', teacherUser.email);

  // Create Sample Class (let Prisma generate UUID)
  const class1 = await prisma.class.create({
    data: {
      name: 'Grade 10A',
      teacherId: teacher.id
    }
  });
  console.log('✅ Class created:', class1.name);

  // Create Sample Parent
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@school.com' },
    update: {},
    create: {
      name: 'Jane Doe',
      email: 'parent@school.com',
      passwordHash: hashPassword('parent123'),
      role: 'PARENT',
      devices: {
        create: {
          deviceId: 'parent-device',
          verified: true
        }
      }
    }
  });

  const parent = await prisma.parent.upsert({
    where: { userId: parentUser.id },
    update: {},
    create: {
      userId: parentUser.id
    }
  });
  console.log('✅ Parent created:', parentUser.email);

  // Create Sample Student
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@school.com' },
    update: {},
    create: {
      name: 'Alice Johnson',
      email: 'student@school.com',
      passwordHash: hashPassword('student123'),
      role: 'STUDENT',
      devices: {
        create: {
          deviceId: 'student-device',
          verified: true
        }
      }
    }
  });

  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      parentId: parent.id,
      classId: class1.id
    }
  });
  console.log('✅ Student created:', studentUser.email);

  // Create Fee Account for Student
  await prisma.fee.upsert({
    where: { studentId: student.id },
    update: {},
    create: {
      studentId: student.id,
      balance: 5000,
      lowBalanceThreshold: 1000
    }
  });
  console.log('✅ Fee account created with balance: $5000');

  // Create Sample Grades
  await prisma.grade.createMany({
    data: [
      {
        studentId: student.id,
        subjectId: mathSubject.id,
        score: 85.5,
        term: 'Term 1'
      },
      {
        studentId: student.id,
        subjectId: physicsSubject.id,
        score: 78.0,
        term: 'Term 1'
      },
      {
        studentId: student.id,
        subjectId: englishSubject.id,
        score: 92.0,
        term: 'Term 1'
      }
    ],
    skipDuplicates: true
  });
  console.log('✅ Sample grades created');

  // Create Sample Attendance (fix date mutation bug)
  const today = new Date();
  const dayMinus2 = new Date(today);
  dayMinus2.setDate(today.getDate() - 2);
  const dayMinus1 = new Date(today);
  dayMinus1.setDate(today.getDate() - 1);
  
  await prisma.attendance.createMany({
    data: [
      {
        studentId: student.id,
        date: dayMinus2,
        status: 'PRESENT'
      },
      {
        studentId: student.id,
        date: dayMinus1,
        status: 'PRESENT'
      },
      {
        studentId: student.id,
        date: new Date(),
        status: 'PRESENT'
      }
    ],
    skipDuplicates: true
  });
  console.log('✅ Sample attendance created');

  // Create Sample Timetable
  await prisma.timetable.createMany({
    data: [
      {
        classId: class1.id,
        subjectId: mathSubject.id,
        teacherId: teacher.id,
        day: 'Monday',
        startTime: '08:00',
        endTime: '09:00',
        room: 'Room 101'
      },
      {
        classId: class1.id,
        subjectId: physicsSubject.id,
        teacherId: teacher.id,
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        room: 'Lab 2'
      },
      {
        classId: class1.id,
        subjectId: englishSubject.id,
        teacherId: teacher.id,
        day: 'Tuesday',
        startTime: '08:00',
        endTime: '09:00',
        room: 'Room 102'
      }
    ],
    skipDuplicates: true
  });
  console.log('✅ Sample timetable created');

  // Create Sample Fee Transactions (CRITICAL for finance system)
  const fee = await prisma.fee.findUnique({ where: { studentId: student.id } });
  if (fee) {
    await prisma.feeTransaction.createMany({
      data: [
        {
          feeId: fee.id,
          type: 'DEPOSIT',
          amount: 3000,
          status: 'COMPLETED',
          description: 'Initial tuition payment',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        },
        {
          feeId: fee.id,
          type: 'DEPOSIT',
          amount: 2000,
          status: 'COMPLETED',
          description: 'Second installment',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
        },
        {
          feeId: fee.id,
          type: 'WITHDRAW',
          amount: 500,
          status: 'PENDING',
          description: 'Refund request for unused materials',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        }
      ],
      skipDuplicates: true
    });
    console.log('✅ Sample fee transactions created (2 deposits, 1 pending withdrawal)');
  }

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📝 Test Accounts:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Super Admin:');
  console.log('  Email: admin@gmil.com');
  console.log('  Password: admin123');
  console.log('  Role: ADMIN (Full Access)\n');
  console.log('Teacher:');
  console.log('  Email: teacher@school.com');
  console.log('  Password: teacher123');
  console.log('  Role: TEACHER\n');
  console.log('Parent:');
  console.log('  Email: parent@school.com');
  console.log('  Password: parent123');
  console.log('  Role: PARENT\n');
  console.log('Student:');
  console.log('  Email: student@school.com');
  console.log('  Password: student123');
  console.log('  Role: STUDENT');
  console.log('  Balance: $5000\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    // @ts-ignore - process is available in Node.js runtime
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
