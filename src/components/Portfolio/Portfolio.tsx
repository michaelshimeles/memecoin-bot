import { VStack } from '@chakra-ui/react';
import React from 'react'
import PortfolioCard from './PortfolioCard';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useGetMintWalletInfo } from '@/hooks/useGetMintWalletInfo';
import { useUser } from '@supabase/auth-helpers-react';

interface PortfolioProps {

}

const Portfolio: React.FC<PortfolioProps> = ({ }) => {
    const user = useUser()
    const { data: mintWallet } = useGetMintWalletInfo(user?.user_metadata?.name)

    const { data: portfolio } = usePortfolio(mintWallet?.public_key)

    console.log("Portfolio", portfolio?.data)
    return (
        <VStack>
            {portfolio?.data && portfolio?.data.map((coin: any, index: number) => {
                console.log("c", coin)
                return (<PortfolioCard name={coin?.attributes?.fungible_info?.name} key={index} symbol={coin?.attributes?.fungible_info?.symbol} amount={coin?.attributes.quantity.numeric} address={coin?.attributes?.fungible_info?.implementations?.[0]?.address} />)
            })}
        </VStack>
    );

}

export default Portfolio;