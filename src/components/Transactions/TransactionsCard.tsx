import { Card, Text, Stack, CardBody, Heading, CardFooter, HStack, Popover, PopoverTrigger, Button, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, VStack, Input, Badge } from '@chakra-ui/react';
import React from 'react'
import { useGetTxInfo } from '@/hooks/useGetTxInfo';
interface TransactionsCardProps {
    hash: string
}

const TransactionsCard: React.FC<TransactionsCardProps> = ({ hash }) => {

    const { data: txInfo } = useGetTxInfo(hash)
    return (
        <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            w="500px"
            bgColor="blackAlpha.900"
            border="1px solid"
            borderColor="whiteAlpha.300"
        >
            <Stack w="full">
                <CardBody>
                    <Heading size='sm'>{hash}</Heading>
                    {(txInfo?.status === "INCLUDED")
                        && <VStack align="flex-start" w="100%" pt="0.5rem">
                            <Text fontSize="sm">Value: {txInfo?.transaction?.value / Math.pow(10, 18)} ETH</Text>
                            <Text fontSize="sm">Your Wallet: {txInfo?.transaction?.from}</Text>
                            <Text fontSize="sm">To: {txInfo?.transaction?.to}</Text>
                            <Text fontSize="sm">Gas Limit: {txInfo?.transaction?.gasLimit}</Text>
                            <Text fontSize="sm">maxFeePerGas: {txInfo?.transaction?.maxFeePerGas}</Text>
                            <Text fontSize="sm">nonce: {txInfo?.transaction?.nonce}</Text>
                        </VStack>}
                </CardBody>
                <CardFooter>
                    <VStack align="flex-start" w="full">
                        <VStack>
                            <HStack w="full">
                                {txInfo?.status === "INCLUDED" ?

                                    <>
                                        <Text fontSize="xs">Status:</Text><Badge variant='solid' colorScheme='green'>{txInfo?.status}</Badge>
                                    </> : <>
                                        <Text fontSize="xs">Status:</Text><Badge variant='solid' colorScheme='red'>{txInfo?.status}</Badge>
                                    </>
                                }
                                {txInfo?.status !== "INCLUDED" && (
                                    <>
                                        <Text fontSize="sm">simError:</Text>
                                        <Badge> {txInfo?.simError}</Badge>
                                    </>)}
                            </HStack>
                            <HStack justify="flex-start" w="full">
                                <Text fontSize="sm">seenInMempool:</Text><Badge>{String(txInfo?.seenInMempool)}</Badge>
                            </HStack>
                        </VStack>
                        <Text fontSize="xs">Transactions will not show on Etherscan because we are using flashbot RPC to get tx straight to the miner not the mempool</Text>
                    </VStack>
                </CardFooter>
            </Stack>
        </Card >
    );
}

export default TransactionsCard;