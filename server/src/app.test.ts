import { describe, it, expect, beforeAll, afterAll } from 'vitest';

let url = 'http://localhost:8080';

describe('API 테스트 - 기본 fetch 사용', () => {
  it('GET / - 메인 HTML 반환', async () => {
    const res = await fetch(`${url}/`);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('<!DOCTYPE html'); // HTML 검증
  });

  it('POST /account/create - 사용자 생성', async () => {
    const res = await fetch(`${url}/account/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        name: '테스터',
        password: '1234'
      })
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('id');
  });

  it('POST /account/login - 실패 케이스', async () => {
    const res = await fetch(`${url}/account/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'notfound@example.com',
        password: 'wrong'
      })
    });
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json).toHaveProperty('error');
  });
});
