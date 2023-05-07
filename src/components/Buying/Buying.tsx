import { useGetMintWalletInfo } from '@/hooks/useGetMintWalletInfo';
import { realTx } from '@/utils/buy';
import {
    Button,
    Divider,
    Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, HStack,
    Heading, Input,
    Stat,
    StatArrow,
    StatLabel,
    StatNumber,
    Text,
    VStack,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useForm } from "react-hook-form";
import { useGetTokenInfo } from '@/hooks/useGetTokenInfo';
import Link from 'next/link';
import { useState } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons'


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
    console.log("Token", data)

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
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent bgColor="blackAlpha.900" borderRight="1px solid"
                    borderColor="gray.700">
                    <DrawerHeader bgColor="blackAlpha.400" borderBottom="1px solid" borderColor="gray.700" >
                        <HStack justify="space-between" align="center">
                            <Text>{data?.pairs?.[0]?.baseToken?.name + " " + "(" + data?.pairs?.[0]?.baseToken?.symbol + ")"}</Text>
                            <Link href={data?.pairs?.[0]?.url} target="_blank">
                                <ExternalLinkIcon />
                            </Link>
                        </HStack>
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack gap="1rem" w="full" pt="1rem">
                            <VStack bgColor="gray.900" p="1rem" rounded="2xl" w="full" align="flex-start">
                                <Text fontSize="sm">{"🏷️ Price: " + "$" + data?.pairs?.[0]?.priceUsd.toLocaleString()}</Text>
                                <Text fontSize="sm">{"👾 Price: " + "Ξ" + data?.pairs?.[0]?.priceNative.toLocaleString()}</Text>
                                <Text fontSize="sm">{"📊 Liquidity: $" + data?.pairs?.[0]?.liquidity?.usd.toLocaleString()}</Text>
                                <Text fontSize="sm">{"💰 FDV: $" + (data?.pairs?.[0]?.fdv.toLocaleString())}</Text>
                                <Text fontSize="xs">{"Created At: " + new Date(data?.pairs?.[0]?.pairCreatedAt).toLocaleDateString() + " " + new Date(data?.pairs?.[0]?.pairCreatedAt).toLocaleTimeString()}</Text>
                            </VStack>
                            <Stat bgColor="gray.900" p="1rem" rounded="2xl" w="full">
                                <StatLabel>Token Stats</StatLabel>
                                <StatNumber fontSize="lg">5m</StatNumber>
                                {data?.pairs?.[0]?.priceChange?.m5 > 0 ? <StatArrow type='increase' /> : <StatArrow type='decrease' />}
                                {data?.pairs?.[0]?.priceChange?.m5 + "%"}
                                <Divider pt="1rem" mb="1rem" w="full" />
                                <Text fontSize="sm">{"Buys: " + data?.pairs?.[0]?.txns?.m5?.buys + " " + "Sells: " + data?.pairs?.[0]?.txns?.m5?.sells}</Text>
                                <Text fontSize="sm">{"Volume: $" + data?.pairs?.[0]?.volume?.m5.toLocaleString()}</Text>
                            </Stat>
                            <Stat bgColor="gray.900" p="1rem" rounded="2xl" w="full">
                                <StatLabel>Token Stats</StatLabel>
                                <StatNumber fontSize="lg">1hr</StatNumber>
                                {data?.pairs?.[0]?.priceChange?.h1 > 0 ? <StatArrow type='increase' /> : <StatArrow type='decrease' />}
                                {data?.pairs?.[0]?.priceChange?.h1 + "%"}
                                <Divider pt="1rem" mb="1rem" w="full" />
                                <Text fontSize="sm">{"Buys: " + data?.pairs?.[0]?.txns?.h1?.buys + " " + "Sells: " + data?.pairs?.[0]?.txns?.h1?.sells}</Text>
                                <Text fontSize="sm">{"Volume: $" + data?.pairs?.[0]?.volume?.h1.toLocaleString()}</Text>
                            </Stat>
                            <Stat bgColor="gray.900" p="1rem" rounded="2xl" w="full">
                                <StatLabel>Token Stats</StatLabel>
                                <StatNumber fontSize="lg">6hr</StatNumber>
                                {data?.pairs?.[0]?.priceChange?.h6 > 0 ? <StatArrow type='increase' /> : <StatArrow type='decrease' />}
                                {data?.pairs?.[0]?.priceChange?.h6 + "%"}
                                <Divider pt="1rem" mb="1rem" w="full" />
                                <Text fontSize="sm">{"Buys: " + data?.pairs?.[0]?.txns?.h6?.buys + " " + "Sells: " + data?.pairs?.[0]?.txns?.h6?.sells}</Text>
                                <Text fontSize="sm">{"Volume: $" + data?.pairs?.[0]?.volume?.h6.toLocaleString()}</Text>
                            </Stat>
                            <Stat bgColor="gray.900" p="1rem" rounded="2xl" w="full">
                                <StatLabel>Token Stats</StatLabel>
                                <StatNumber fontSize="lg">24hr</StatNumber>
                                {data?.pairs?.[0]?.priceChange?.h24 > 0 ? <StatArrow type='increase' /> : <StatArrow type='decrease' />}
                                {data?.pairs?.[0]?.priceChange?.h24 + "%"}
                                <Divider pt="1rem" mb="1rem" w="full" />
                                <Text fontSize="sm">{"Buys: " + data?.pairs?.[0]?.txns?.h24?.buys + " " + "Sells: " + data?.pairs?.[0]?.txns?.h24?.sells}</Text>
                                <Text fontSize="sm">{"Volume: $" + data?.pairs?.[0]?.volume?.h24.toLocaleString()}</Text>
                            </Stat>
                        </VStack>
                    </DrawerBody>

                    <DrawerFooter>
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