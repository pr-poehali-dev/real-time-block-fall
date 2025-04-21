
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-5xl font-bold mb-6">Симулятор падения блоков</h1>
        <p className="text-xl mb-8">
          Выберите из 20 различных блоков, настройте их физику и графику, 
          и наблюдайте за их реалистичным падением в нашем симуляторе.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link to="/block-simulator">Запустить симулятор</Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-16 max-w-4xl px-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Особенности симулятора</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-5 rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">20 уникальных блоков</h3>
            <p>От песка, который рассыпается при ударе, до металла с отскоком. Каждый блок ведет себя по-своему.</p>
          </div>
          <div className="bg-card p-5 rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">Настройка физики</h3>
            <p>Регулируйте гравитацию, отскок, трение и другие параметры для достижения желаемого эффекта.</p>
          </div>
          <div className="bg-card p-5 rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">Реалистичная графика</h3>
            <p>Настраивайте текстуры, освещение и эффекты для максимальной реалистичности симуляции.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
