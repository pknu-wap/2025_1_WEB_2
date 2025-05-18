# 🔒GET `/letter/get_all_of_me`

status: ❗ (API는 있지만 변경될 가능성이 높음)

나의 모든 편지를 불러옵니다.
주의: 내가 받거나 보낸 편지를 모두 불러옵니다.

```jsx
/**
 * 아래는 JavaScript에서 사용 가능한 JSDoc 타입 주석입니다.
 * 복사해서 활용해 주시면 자동완성에 도움이 됩니다.
 * 만약 아래의 주석에서 에러가 난다면, 연락 부탁드립니다.
 */
 
/**
 * @typedef {Letter}
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {number} user_id_from
 * @property {number} user_id_to
 * @property {number} time_send    e.g. {let d=new Date();d.setTime(time);return d;}
 * @property {number} time_receive e.g. {let d=new Date();d.setTime(time);return d;}
 * @property {string} email_get_notify_receive
 * @property {boolean} is_public
 * @property {boolean} is_sent
 */
  
/**
 * @typedef {Object} ApiLetterGetAllOfMeResult
 * @property {?Letter[]} arr_letter
 * @property {?string} error
 */
 
 /**
 * @typedef {Object} ApiAuthInfo
 * @property {string} token (Bearer Token으로 POST해 주세요)
 */
 
/**
 * @property {(auth: ApiAuthInfo) => ApiLetterGetAllOfMeResult}
 */
let api = {
  letter_get_all_of_me: (auth) => {~~~}
}
```

- 상태 코드

| 200 | `OK` |  |
| --- | --- | --- |
| 500 | `Internal Error` |  |


# 🔒GET `/letter/get_all_of_me/sent`

status: ❗ (API는 있지만 변경될 가능성이 높음)

로그인한 사용자가 보낸 편지(is_sent = true)인 편지들 전체를 조회합니다.
주의: 내가 받거나 보낸 편지를 모두 불러옵니다.

```jsx
/**
 * 아래는 JavaScript에서 사용 가능한 JSDoc 타입 주석입니다.
 * 복사해서 활용해 주시면 자동완성에 도움이 됩니다.
 * 만약 아래의 주석에서 에러가 난다면, 연락 부탁드립니다.
 */
 
/**
 * @typedef {Letter}
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {number} user_id_from
 * @property {number} user_id_to
 * @property {number} time_send    e.g. {let d=new Date();d.setTime(time);return d;}
 * @property {number} time_receive e.g. {let d=new Date();d.setTime(time);return d;}
 * @property {string} email_get_notify_receive
 * @property {boolean} is_public
 * @property {boolean} is_sent
 */
  
/**
 * @typedef {Object} ApiLetterGetAllOfMeResult
 * @property {?Letter[]} arr_letter
 * @property {?string} error
 */
 
 /**
 * @typedef {Object} ApiAuthInfo
 * @property {string} token (Bearer Token으로 POST해 주세요)
 */
 
/**
 * @property {(auth: ApiAuthInfo) => ApiLetterGetAllOfMeResult}
 */
let api = {
  letter_get_all_of_me_sent: (auth) => {~~~}
}
```

- 상태 코드

| 200 | `OK` |  |
| --- | --- | --- |
| 500 | `Internal Error` |  |

# 🔒GET `/letter/get_all_of_me/unsent`

status: ❗ (API는 있지만 변경될 가능성이 높음)

로그인한 사용자가 보냈지만 아직 전송되지 않은 편지(is_sent = false) 목록을 조회합니다.
주의: 내가 받거나 보낸 편지를 모두 불러옵니다.

```jsx
/**
 * 아래는 JavaScript에서 사용 가능한 JSDoc 타입 주석입니다.
 * 복사해서 활용해 주시면 자동완성에 도움이 됩니다.
 * 만약 아래의 주석에서 에러가 난다면, 연락 부탁드립니다.
 */
 
/**
 * @typedef {Letter}
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {number} user_id_from
 * @property {number} user_id_to
 * @property {number} time_send    e.g. {let d=new Date();d.setTime(time);return d;}
 * @property {number} time_receive e.g. {let d=new Date();d.setTime(time);return d;}
 * @property {string} email_get_notify_receive
 * @property {boolean} is_public
 * @property {boolean} is_sent
 */
  
/**
 * @typedef {Object} ApiLetterGetAllOfMeResult
 * @property {?Letter[]} arr_letter
 * @property {?string} error
 */
 
 /**
 * @typedef {Object} ApiAuthInfo
 * @property {string} token (Bearer Token으로 POST해 주세요)
 */
 
/**
 * @property {(auth: ApiAuthInfo) => ApiLetterGetAllOfMeResult}
 */
let api = {
  letter_get_all_of_me_unsent: (auth) => {~~~}
}
```

- 상태 코드

| 200 | `OK` |  |
| --- | --- | --- |
| 500 | `Internal Error` |  |