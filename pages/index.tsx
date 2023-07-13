import Head from 'next/head';
import { Inter } from 'next/font/google';
import {useRouter} from "next/router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import {useEffect, useState} from "react";

import {factoryBarColors, months} from "@/common/constants";
import styles from '@/styles/Home.module.css';
import {IProduct} from "@/common/interfaces/Product";
import {getMonthFromDateStr} from "@/common/utils";

const inter = Inter({ subsets: ['latin'] });

interface IFactoryProductsInMonth {
  month: string;
  factory1: number;
  factory2: number;
}

const getProductsByMonth = async (): Promise<Array<IFactoryProductsInMonth>> => {
  const res = await fetch('http://localhost:3001/products');
  const data = await res.json();
  
  const dataGroupedByMonth = [...Array(12)].map((_, i) => ({
    month: months[i],
    factory1: 0,
    factory2: 0
  }));
  
  data.forEach((elem: IProduct) => {
    if (elem.date) {
      const month = getMonthFromDateStr(elem.date);
      const productCount = elem.product1 + elem.product2 + elem.product3;
      if (elem.factory_id == 1) {
        dataGroupedByMonth[month].factory1 += productCount;
      } else {
        dataGroupedByMonth[month].factory2 += productCount;
      }
    }
  });
  
  return dataGroupedByMonth.map(elem => ({
    factory1: Math.round(elem.factory1 / 1000),
    factory2: Math.round(elem.factory2 / 1000),
    month: elem.month,
  }));
};

export default function Home({ data }: any) {
  const [productsAreLoaded, setProductsAreLoaded] = useState<boolean>(false);
  const router = useRouter();
  
  useEffect( () => {
    setProductsAreLoaded(true);
  }, []);

  const handleClick0 = async (data: any, month: number) => {
    await router.push(`/details/1/${month}`);
  }
  
  const handleClick1 = async (data: any, month: number) => {
    await router.push(`/details/2/${month}`);
  }
  
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <p>
            Фильтр по типу продукции
          </p>
          <div>
            <select>
              <option>Продукт 1</option>
              <option>Продукт 2</option>
              <option>Продукт 3</option>
            </select>
          </div>
        </div>

        <div className={styles.center}>
          {productsAreLoaded && <BarChart
              width={980}
              height={400}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="factory1" name="Фабрика A" fill={factoryBarColors[0]} cursor="pointer" onClick={handleClick0} />
            <Bar dataKey="factory2" name="Фабрика Б" fill={factoryBarColors[1]} cursor="pointer" onClick={handleClick1} />
          </BarChart>}
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  return { props: { data: await getProductsByMonth() } }
}
