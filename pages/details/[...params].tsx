import {useRouter} from "next/router";
import {Pie, PieChart, Tooltip} from "recharts";

interface IMonthProduct {
  name: string;
  value: number;
}

export default function Page() {
  const { query } = useRouter();
  const { params } = query;
  const data: Array<IMonthProduct> = [{
    name: 'Продукт 1',
    value: 100,
  }, {
    name: 'Продукт 2',
    value: 200,
  }];

  return (params &&
    <div>
      <p>Details about {params[0]} factory {params[1]} month</p>
      <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        />
        <Tooltip />
      </PieChart>
    </div>
  );
}