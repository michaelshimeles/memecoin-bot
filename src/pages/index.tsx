import Buying from '@/components/Buying/Buying';
import Wallet from '@/components/Wallet/Wallet';
import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack
} from '@chakra-ui/react';
import { useUser } from "@supabase/auth-helpers-react";
import Head from 'next/head';
import Layout from '../components/Layout/Layout';


export default function Home() {
  const user = useUser()

  return (
    <>
      <Head>
        <title>Shitcoin Bot</title>
        <meta name="description" content="Degen into shitcoins fast" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>

        <Tabs w="60rem" pt="3rem">
          <TabList>
            <Tab>Shitcoin Bot</Tab>
            <Tab>Wallet Manager</Tab>
            <Tab>Transactions</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {user ? <Buying /> : <VStack pt="4rem"><Heading>Need to Login</Heading></VStack>}
            </TabPanel>
            <TabPanel>
              {user ? <Wallet /> : <VStack pt="4rem"><Heading>Need to Login</Heading></VStack>}
            </TabPanel>
            <TabPanel>
              <VStack pt="4rem">
                <Heading>Coming Soon</Heading>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>


      </Layout >
    </>
  )
}
