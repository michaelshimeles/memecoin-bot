import { useGetMintWalletInfo } from '@/hooks/useGetMintWalletInfo';
import { sell } from '@/utils/sell';
import { Card, Tooltip, Stack, CardBody, Heading, CardFooter, Button, Text, VStack, Badge, HStack, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Input, useToast } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import React from 'react'
import { useForm } from "react-hook-form";

interface PortfolioCardProps {
    name: string,
    symbol: string,
    amount: any,
    address: string
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ name, symbol, amount, address }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const toast = useToast()
    const user = useUser()

    const handleSellTx = async (token: any, gwei: any, amount: any, public_key: any, private_key: any) => {
        sell(token, gwei, amount, public_key, private_key).then((response) => {


        }).catch((error) => {
            console.log(error)
        })
    }

    const { data: walletInfo } = useGetMintWalletInfo(user?.user_metadata?.name)

    const onSubmit = (data: any) => {
        handleSellTx(address, data?.gwei, data?.amount, walletInfo?.public_key, walletInfo?.private_key)
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
                    <Heading size='md'>{name}</Heading>
                    {name !== "Ethereum" && <Text py='2'>
                        Address: {address}
                    </Text>}
                    <Text py='2'>
                        Amount: {(Math.round(amount * 100) / 100).toLocaleString()}
                    </Text>
                </CardBody>
                <CardFooter>
                    <HStack justify="space-between" w="full">
                        <Popover
                            placement='top'
                            closeOnBlur={false}
                        >
                            <PopoverTrigger>
                                <Tooltip hasArrow label='Not Active Yet'>
                                    <Button variant="outline" colorScheme='black' borderColor="whiteAlpha.300">
                                        Sell
                                    </Button>
                                </Tooltip>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Enter Amount & Gwei!</PopoverHeader>
                                <form onSubmit={handleSubmit(onSubmit)} >
                                    <VStack p="1rem">
                                        <HStack>
                                            <Text>Amount</Text>
                                            <Input defaultValue={amount} {...register("amount", { required: true })} />
                                        </HStack>
                                        <HStack>
                                            <Input placeholder="gwei" {...register("gwei", { required: true })} />
                                            <Button w="100%" type="submit" variant="outline">Sell</Button>
                                        </HStack>
                                    </VStack>
                                </form>
                            </PopoverContent>
                        </Popover>
                        <Badge fontSize="xs" as="b">{symbol}</Badge>
                    </HStack>
                </CardFooter>
            </Stack>
        </Card >
    );
}

export default PortfolioCard;