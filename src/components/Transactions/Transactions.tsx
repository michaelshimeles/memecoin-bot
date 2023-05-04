import { Box, VStack } from '@chakra-ui/react';
import React from 'react'
import TransactionsCard from './TransactionsCard';
import { useGetTransactions } from '@/hooks/useGetTransactions';
import { useUser } from '@supabase/auth-helpers-react';

interface TransactionsProps {

}

const Transactions: React.FC<TransactionsProps> = ({ }) => {
    const user = useUser()
    const { data: transactions } = useGetTransactions(user?.user_metadata?.name)

    return (
        <VStack pt="4rem">
            {transactions?.map((tx: any, index: number) => {
                return (
                    <Box key={index}>
                        <TransactionsCard hash={tx?.hash} />
                    </Box>
                )
            })}
        </VStack>
    );
}

export default Transactions;