import { spawn } from 'child_process';

function generateAbiTypes({ contractName }) {
  const abi = spawn('abi-types-generator', [
    `./src/abis/${contractName}.json`,
    `--output=./src/abi-types`,
    `--name=${contractName}`,
    `--provider=ethers_v5`,
  ]);

  abi.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  abi.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  abi.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

generateAbiTypes({ contractName: 'BuddyDao' });
