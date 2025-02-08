'use strict';

// Skip integration tests when running regular test suite
if (!process.env.BOX_JWT_CONFIG || !process.env.BOX_ADMIN_USER_ID) {
  describe = describe.skip;
}
