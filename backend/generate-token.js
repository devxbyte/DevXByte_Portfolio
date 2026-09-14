const jwt = require('jsonwebtoken');
const fs = require('fs');
const token = jwt.sign({ id: '64d0f8f8b8e0b9b3c4f9a0d2' }, 'ffdhvbdhubudsdwllido848o7orau8ro75thoiejd3yhos894r87ryhfc8h84h84oh587o3uio34uo8t7h7o84r78y4oro84y47', { expiresIn: '1d' });
console.log(token);
