# ERC404 Gambling Platform

A decentralized gambling platform built on Ethereum Layer 2, featuring various games including a Pachinko game.

## Features

- ERC404 Token Integration
- Multiple Gambling Games:
  - Coin Flip
  - Dice Roll
  - Number Guess
  - Pachinko
- Real-time Web3 Integration
- Responsive Design
- Chainlink VRF for Randomness

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MetaMask or another Web3 wallet

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd erc404-gambling
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
PRIVATE_KEY=your_private_key
INFURA_API_KEY=your_infura_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Development

To start the development server:

```bash
npm start
```

This will start a local server at `http://localhost:3000`. Open this URL in your browser to view the application.

## Testing

To run the test suite:

```bash
npm test
```

## Deployment

1. Configure your network settings in `hardhat.config.js`
2. Deploy the contracts:
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── pachinko.html
├── src/
│   ├── styles/
│   │   ├── main.css
│   │   └── pachinko.css
│   └── js/
│       ├── main.js
│       └── pachinko.js
contracts/
├── GamblingToken.sol
└── GamblingGame.sol
scripts/
└── deploy.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 