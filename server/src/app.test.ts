const serverUrl = 'http://localhost:3000'; // 실제 실행된 서버 주소

async function runTests() {
  console.log('테스트 시작...\n');

  // 1. GET /
  try {
    const res = await fetch(`${serverUrl}/`);
    const text = await res.text();
    console.log('✅ GET / 응답 코드:', res.status);
    console.log('HTML 포함 여부:', text.includes('<!DOCTYPE html'));
  } catch (err) {
    console.error('❌ GET / 실패:', err.message);
  }

  // 2. POST /account/create
  try {
    const uniqueEmail = `test${Date.now()}@example.com`;
    const res = await fetch(`${serverUrl}/account/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        name: '테스트사용자',
        password: '1234'
      })
    });
    const json = await res.json();
    console.log('\n✅ POST /account/create 응답 코드:', res.status);
    console.log('응답 데이터:', json);
  } catch (err) {
    console.error('❌ POST /account/create 실패:', err.message);
  }

  // 3. POST /account/login (실패 케이스)
  try {
    const res = await fetch(`${serverUrl}/account/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nonexist@example.com',
        password: 'wrong'
      })
    });
    const json = await res.json();
    console.log('\n✅ POST /account/login 실패 테스트 응답 코드:', res.status);
    console.log('응답:', json);
  } catch (err) {
    console.error('❌ POST /account/login 실패:', err.message);
  }

  console.log('\n테스트 종료');
}

runTests();


// import { describe, it, expect, beforeAll, afterAll } from 'vitest';
// import { createServer } from 'http';
// import app from './app.ts';

// let server: ReturnType<typeof createServer>;
// let url: string;

// // beforeAll(async () => {
// //     await new Promise<void>((resolve) => {
// //       server = createServer(app);
// //       server.listen(0, () => {
// //         const { port } = server.address() as any;
// //         url = `http://localhost:${port}`;
// //         resolve();
// //       });
// //     });
// //   });

// // afterAll(() => {
// //   server.close();
// // });
// describe('API 테스트 - 기본 fetch 사용', () => {
//   it('GET / - 메인 HTML 반환', async () => {
//     const res = await fetch(`${url}/`);
//     expect(res.status).toBe(200);
//     const text = await res.text();
//     expect(text).toContain('<!DOCTYPE html'); // HTML 검증
//   });

//   it('POST /account/create - 사용자 생성', async () => {
//     const res = await fetch(`${url}/account/create`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         email: `test${Date.now()}@example.com`,
//         name: '테스터',
//         password: '1234'
//       })
//     });
//     expect(res.status).toBe(200);
//     const json = await res.json();
//     expect(json).toHaveProperty('id');
//   });

//   it('POST /account/login - 실패 케이스', async () => {
//     const res = await fetch(`${url}/account/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         email: 'notfound@example.com',
//         password: 'wrong'
//       })
//     });
//     expect(res.status).toBe(422);
//     const json = await res.json();
//     expect(json).toHaveProperty('error');
//   });
// });
