const nodeProvider: { [chainId: string]: string } = JSON.parse(process.env.REACT_APP_NODE_PROVIDER as string);

export default nodeProvider;
