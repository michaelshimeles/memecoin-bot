import { useGasPrice } from '@/hooks/useGasPrice';
import { useGetMintWalletInfo } from '@/hooks/useGetMintWalletInfo';
import { realTx } from '@/utils/buy';
import {
    Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, HStack,
    Heading, Input,
    Select,
    Text, useDisclosure,
    VStack,
    useToast,
    Stat,
    StatArrow,
    StatHelpText,
    StatLabel,
    StatNumber,
    Tag,
    TagCloseButton,
    TagLabel
} from '@chakra-ui/react';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useForm } from "react-hook-form";
// import TokenInfo from '../TokenInfo/TokenInfo';
import { useState } from 'react';
import { useGetTokenInfo } from '@/hooks/useGetTokenInfo';
import Link from 'next/link';

interface BuyingProps {

}

const Buying: React.FC<BuyingProps> = ({ }) => {
    const toast = useToast()
    const user = useUser()
    const supabase = useSupabaseClient()
    const [token, setToken] = useState<string>("")
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { data: walletInfo } = useGetMintWalletInfo(user?.user_metadata?.name)

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const handleRealTx = async (token: any, gwei: any, amount: any, public_key: any, private_key: any) => {
        realTx(token, gwei, amount, public_key, private_key).then(async (response) => {

            const { data, error } = await supabase
                .from('transactions')
                .insert([
                    { username: user?.user_metadata?.name, hash: response },
                ]).select()

            toast({
                title: 'Transaction Submitted.',
                description: "Check Transactions for status",
                status: "info",
                duration: 9000,
                isClosable: true,
            })

        }).catch((error) => {
            toast({
                title: 'Transaction Failed.',
                description: error,
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        })
    }

    const onSubmit = (data: any) => {
        console.log(data)
        handleRealTx(data?.token, data?.gwei, data?.amount, walletInfo?.public_key, walletInfo?.private_key)
    }

    const handleTokenInfo = (e: any) => {
        console.log(e.target.value)
        setToken(e.target.value)
    }
    const { data } = useGetTokenInfo(token)

    return (
        <VStack w="100%" pt="2rem">
            <Heading>Memecoin Bot</Heading>
            <Text textAlign="center">Seamlessly front run others into shitcoins with the quickness. Please use a burner wallet and not your actual wallet.</Text>
            <form onSubmit={handleSubmit(onSubmit)} style={{
                width: "100%"
            }}>
                <VStack gap="0.5rem" w="full">
                    <HStack w="full">
                        <Input placeholder="token address" {...register("token", { required: true })} onChange={handleTokenInfo} />
                    </HStack>
                    <Input placeholder="gwei" {...register("gwei", { required: true })} />
                    <Input placeholder="ETH Amount" {...register("amount", { required: true })} />
                    <Input defaultValue={walletInfo?.public_key} disabled />
                    <HStack pt="1rem" justify="center">
                        <Button type="submit" variant="outline">Gen Wealth</Button>
                        {token && data?.pairs && <Button variant="outline" onClick={onOpen}>📊 Token Info</Button>}
                    </HStack>
                </VStack>
            </form>
            {/* <TokenInfo tokenAddress={token} /> */}
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent bgColor="blackAlpha.900" borderRight="1px solid"
                    borderColor="gray.700"
                >
                    <DrawerCloseButton />
                    <DrawerHeader bgColor="blackAlpha.400" borderBottom="1px solid" borderColor="gray.700">{data?.pairs?.[0]?.baseToken?.name + " " + "(" + data?.pairs?.[0]?.baseToken?.symbol + ")"}</DrawerHeader>

                    <DrawerBody>
                        <VStack gap="1rem" w="full" pt="1rem">
                            <VStack bgColor="gray.900" p="1rem" rounded="2xl" w="full" align="flex-start">
                                <Text>{"📊 Liquidity (USD): $" + data?.pairs?.[0]?.liquidity?.usd.toLocaleString()}</Text>
                            </VStack>
                            <Stat bgColor="gray.900" p="1rem" rounded="2xl" w="full">
                                <StatLabel>Price Change</StatLabel>
                                <StatNumber>5m</StatNumber>
                                {data?.pairs?.[0]?.priceChange?.m5 > 0 ? <StatArrow type='increase' /> : <StatArrow type='decrease' />}
                                {data?.pairs?.[0]?.priceChange?.m5 + "%"}
                                <Text>{"Buys: " + data?.pairs?.[0]?.txns?.m5?.buys + " " + "Sells: " + data?.pairs?.[0]?.txns?.m5?.sells}</Text>

                            </Stat>
                            <Stat bgColor="gray.900" p="1rem" rounded="2xl" w="full">
                                <StatLabel>Price Change</StatLabel>
                                <StatNumber>1hr</StatNumber>
                                {data?.pairs?.[0]?.priceChange?.h1 > 0 ? <StatArrow type='increase' /> : <StatArrow type='decrease' />}
                                {data?.pairs?.[0]?.priceChange?.h1 + "%"}
                                <Text>{"Buys: " + data?.pairs?.[0]?.txns?.h1?.buys + " " + "Sells: " + data?.pairs?.[0]?.txns?.h1?.sells}</Text>
                            </Stat>
                            <Stat bgColor="gray.900" p="1rem" rounded="2xl" w="full">
                                <StatLabel>Price Change</StatLabel>
                                <StatNumber>6hr</StatNumber>
                                {data?.pairs?.[0]?.priceChange?.h6 > 0 ? <StatArrow type='increase' /> : <StatArrow type='decrease' />}
                                {data?.pairs?.[0]?.priceChange?.h6 + "%"}
                                <Text>{"Buys: " + data?.pairs?.[0]?.txns?.h6?.buys + " " + "Sells: " + data?.pairs?.[0]?.txns?.h6?.sells}</Text>
                            </Stat>
                            <Stat bgColor="gray.900" p="1rem" rounded="2xl" w="full">
                                <StatLabel>Price Change</StatLabel>
                                <StatNumber>24hr</StatNumber>
                                {data?.pairs?.[0]?.priceChange?.h24 > 0 ? <StatArrow type='increase' /> : <StatArrow type='decrease' />}
                                {data?.pairs?.[0]?.priceChange?.h24 + "%"}
                                <Text>{"Buys: " + data?.pairs?.[0]?.txns?.h24?.buys + " " + "Sells: " + data?.pairs?.[0]?.txns?.h24?.sells}</Text>
                            </Stat>
                        </VStack>

                        {/* <Text>{"Created at: " + (new Date(data?.pairs?.[0]?.pairCreatedAt).toLocaleDateString()) + " " + new Date(data?.pairs?.[0]?.pairCreatedAt).toLocaleTimeString()}</Text>
                        <Text>{"FDV: $" + (data?.pairs?.[0]?.fdv.toLocaleString())}</Text>
                        <Text>{"Price (USD): " + "$" + data?.pairs?.[0]?.priceUsd.toLocaleString()}</Text>
                        <Text>{"Price (ETH): " + data?.pairs?.[0]?.priceNative.toLocaleString()}</Text>
                        <Text>{"Liquidity (USD): $" + data?.pairs?.[0]?.liquidity?.usd.toLocaleString()}</Text>
                        <Text as="u">Volume</Text>
                        <Text>{"5m: $" + data?.pairs?.[0]?.volume?.m5.toLocaleString()}</Text>
                        <Text>{"1h: $" + data?.pairs?.[0]?.volume?.h1.toLocaleString()}</Text>
                        <Text>{"6h: $" + data?.pairs?.[0]?.volume?.h6.toLocaleString()}</Text>
                        <Text>{"24h: $" + data?.pairs?.[0]?.volume?.h24.toLocaleString()}</Text>
                        <Text as="u">Price Change</Text>
                        <Text>{"5m: " + data?.pairs?.[0]?.priceChange?.m5 + "%"}</Text>
                        <Text>{"1h: " + data?.pairs?.[0]?.priceChange?.h1 + "%"}</Text>
                        <Text>{"6h: " + data?.pairs?.[0]?.priceChange?.h6 + "%"}</Text>
                        <Text>{"24h: " + data?.pairs?.[0]?.priceChange?.h24 + "%"}</Text>
                        <Text as="u">Transactions</Text>
                        <Text>5m</Text>
                        <Text>{"Buys: " + data?.pairs?.[0]?.txns?.m5?.buys + " " + "Sells: " + data?.pairs?.[0]?.txns?.m5?.sells}</Text>
                        <Text>1hr</Text>
                        <Text>{"Buys: " + data?.pairs?.[0]?.txns?.h1?.buys + " " + "Sells: " + data?.pairs?.[0]?.txns?.h1?.sells}</Text>
                        <Text>6hr</Text>
                        <Text>{"Buys: " + data?.pairs?.[0]?.txns?.h6?.buys + " " + "Sells: " + data?.pairs?.[0]?.txns?.h6?.sells}</Text>
                        <Text>24hr</Text>
                        <Text>{"Buys: " + data?.pairs?.[0]?.txns?.h24?.buys + " " + "Sells: " + data?.pairs?.[0]?.txns?.h24?.sells}</Text> */}
                    </DrawerBody>

                    <DrawerFooter>
                        <Link href={data?.pairs?.[0]?.url}>
                            <Button variant='outline' mr={3}>Chart</Button>
                        </Link>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </VStack>
    );
}

export default Buying;