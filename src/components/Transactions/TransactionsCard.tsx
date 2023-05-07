import { Card, useToast, Text, Stack, CardBody, Heading, CardFooter, HStack, Popover, PopoverTrigger, Button, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, VStack, Input, Badge } from '@chakra-ui/react';
import React from 'react'
import { useGetTxInfo } from '@/hooks/useGetTxInfo';
import axios from "axios"
interface TransactionsCardProps {
    hash: string
}

const TransactionsCard: React.FC<TransactionsCardProps> = ({ hash }) => {

    const { data: txInfo } = useGetTxInfo(hash)
    const toast = useToast()

    const handleCancelTx = () => {
        axios.get(`${process.env.NEXT_PUBLIC_URL}/api/cancel`, {
            params: {
                hash,
            },
        })
            .then((result: any) => {
                console.log("result?.data", result?.data)
                toast({
                    title: 'Tx Successfully Cancelled.',
                    description: result?.data,
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
            })
            .catch((error: any) => {
                toast({
                    title: 'Cancellation failed.',
                    description: error,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })

                throw error
            });
    }
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
                        {(txInfo?.status === "INCLUDED" && txInfo?.status === "FAILED") && <VStack w="full" align="flex-end">
                            <Button size="sm" onClick={handleCancelTx}>Cancel Tx</Button>
                        </VStack>}
                    </VStack>
                </CardFooter>
            </Stack>
        </Card >
    );
}

export default TransactionsCard;