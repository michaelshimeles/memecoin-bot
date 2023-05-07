// import { VStack, Text } from '@chakra-ui/react';
// import React from 'react'
// import { useGetTokenInfo } from '@/hooks/useGetTokenInfo';

// interface TokenInfoProps {
//     tokenAddress: string
// }

// const TokenInfo: React.FC<TokenInfoProps> = ({ tokenAddress }) => {

//     if (tokenAddress === "") {
//         return <></>
//     }

//     const { data } = useGetTokenInfo(tokenAddress)

//     console.log("Data", data)
//     console.log("Token Info", data?.pairs?.[0])
//     console.log("name", data?.pairs?.[0]?.baseToken?.name)
//     console.log("symbol", data?.pairs?.[0]?.baseToken?.symbol)
//     console.log("dexId", data?.pairs?.[0]?.dexId)
//     console.log("fdv", data?.pairs?.[0]?.fdv)
//     console.log("liquidity", data?.pairs?.[0]?.liquidity)
//     console.log("pairCreatedAt", data?.pairs?.[0]?.pairCreatedAt)
//     console.log("priceChange", data?.pairs?.[0]?.priceChange)
//     console.log("priceNative", data?.pairs?.[0]?.priceNative)
//     console.log("priceUsd", data?.pairs?.[0]?.priceUsd)
//     console.log("txns", data?.pairs?.[0]?.txns)
//     console.log("volume", data?.pairs?.[0]?.volume)
//     console.log("url", data?.pairs?.[0]?.url)

//     return (
        
        
//     );
// }

// export default TokenInfo;