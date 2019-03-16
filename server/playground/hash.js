const bcrypt = require('bcrypt');

const run = async () => {
  const hash = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('love', hash);
  console.log(password);

  const confirmPassword = await bcrypt.compare('love1', password);
  if (confirmPassword) console.log(confirmPassword);
};

run();
