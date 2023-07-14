import {useRouter} from "next/router";
import {Pie, PieChart, Tooltip} from "recharts";
import {useEffect, useState} from "react";

import {IProduct} from "@/common/interfaces/Product";
import {getMonthFromDateStr} from "@/common/utils";
import styles from '@/styles/Home.module.css';
import {months, productTypes} from "@/common/constants";

interface IMonthProduct {
    name: string;
    value: number;
}

export default function Page() {
    const [products, setProducts] = useState<Array<IMonthProduct>>([]);
    const { query } = useRouter();

    useEffect(() => {
        (async () => {
            const res = await fetch('http://localhost:3001/products');
            const data = await res.json();

            const { factory_id, month } = query;
            const result: Array<IMonthProduct> = productTypes.filter(productType => productType.id > 0)
                .map(productType => ({name: productType.value, value: 0}));

            if (factory_id && month) {
                data.filter((product: IProduct) =>
                    product.factory_id === +factory_id && getMonthFromDateStr(product.date) === +month)
                    .forEach((elem: IProduct) => {
                        result[0].value += elem.product1;
                        result[1].value += elem.product2;
                        result[2].value += elem.product3;
                    });
            }

            setProducts(result);
        })()
    }, [query]);

    const { factory_id, month } = query;

    return (
        <div className={styles.main}>
            {factory_id && month
                && <h2>производство продукции на Фабрике {+factory_id === 1 ? 'A' : 'Б'} в {months[+month]}</h2>
            }
            <PieChart width={600} height={350}>
                <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={products}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                />
                <Tooltip />
            </PieChart>
        </div>
    );
}