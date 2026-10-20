'use strict';

// Status reports are written to stderr when it is a TTY, which would change the
// output that tests compare against. Tests that cover reporting enable it.
process.env.BOX_PROGRAM_STATUS = '0';
