
import { useState, useRef, useEffect } from "react";
import { BlockSelector, type BlockType } from "@/components/BlockSelector";
import { PhysicsControls } from "@/components/PhysicsControls";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { PlayCircle, RotateCcw, Settings2 } from "lucide-react";

export default function BlockSimulator() {
  const [selectedBlock, setSelectedBlock] = useState<BlockType | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [graphicsQuality, setGraphicsQuality] = useState(0.7);
  const [showSettings, setShowSettings] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // Обновление свойств выбранного блока
  const handleUpdateProperties = (properties: BlockType["properties"]) => {
    if (selectedBlock) {
      setSelectedBlock({
        ...selectedBlock,
        properties
      });
    }
  };

  // Запуск симуляции падения
  const startSimulation = () => {
    if (!selectedBlock) {
      toast({
        title: "Выберите блок",
        description: "Сначала выберите блок для симуляции",
        variant: "destructive"
      });
      return;
    }
    
    setSimulationRunning(true);
    setShowSettings(false);
    
    // В реальном приложении здесь будет инициализация физического движка
    setTimeout(() => {
      initPhysicsSimulation();
    }, 100);
  };
  
  // Сброс симуляции
  const resetSimulation = () => {
    setSimulationRunning(false);
    setShowSettings(true);
    
    // Очистка канваса
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };
  
  // Инициализация физической симуляции
  const initPhysicsSimulation = () => {
    if (!canvasRef.current || !selectedBlock) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Настройка размеров канваса по размеру контейнера
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Начальные параметры для блока
    const blockSize = 50;
    const blockX = canvas.width / 2 - blockSize / 2;
    const blockY = 0; // Начальная позиция вверху
    
    // Физические параметры
    let velocity = 0;
    const gravity = 0.2 + selectedBlock.properties.density * 0.3;
    const bounce = selectedBlock.properties.restitution;
    const friction = selectedBlock.properties.friction;
    const fragility = selectedBlock.properties.fragility;
    
    // Состояние блока
    let blockYPos = blockY;
    let blockXPos = blockX;
    let velocityX = 0;
    let isFragmented = false;
    let fragments: { x: number, y: number, size: number, vx: number, vy: number }[] = [];
    
    // Анимация падения
    const animate = () => {
      if (!simulationRunning) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Если блок еще не разбился
      if (!isFragmented) {
        velocity += gravity;
        blockYPos += velocity;
        
        // Отскок от дна
        if (blockYPos + blockSize > canvas.height) {
          blockYPos = canvas.height - blockSize;
          velocity = -velocity * bounce;
          
          // Применение трения при касании пола
          velocityX *= (1 - friction * 0.1);
          
          // Проверка хрупкости - возможно разбить блок
          if (Math.abs(velocity) > 5 && Math.random() < fragility) {
            isFragmented = true;
            // Создание фрагментов
            const fragmentCount = 20 + Math.floor(fragility * 30);
            for (let i = 0; i < fragmentCount; i++) {
              fragments.push({
                x: blockXPos + Math.random() * blockSize,
                y: blockYPos + Math.random() * blockSize,
                size: 2 + Math.random() * 8,
                vx: (Math.random() - 0.5) * 5,
                vy: -Math.random() * 10
              });
            }
          }
        }
        
        // Отрисовка блока в зависимости от типа
        switch (selectedBlock.type) {
          case "solid":
            ctx.fillStyle = getBockColor(selectedBlock);
            ctx.fillRect(blockXPos, blockYPos, blockSize, blockSize);
            break;
          case "liquid":
            ctx.fillStyle = getBockColor(selectedBlock);
            ctx.beginPath();
            ctx.arc(blockXPos + blockSize/2, blockYPos + blockSize/2, blockSize/2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "powder":
            // Визуальный эффект песка/порошка
            const grainSize = 3;
            const grainCount = 50;
            ctx.fillStyle = getBockColor(selectedBlock);
            for (let i = 0; i < grainCount; i++) {
              const grainX = blockXPos + Math.random() * blockSize;
              const grainY = blockYPos + Math.random() * blockSize;
              ctx.beginPath();
              ctx.arc(grainX, grainY, grainSize, 0, Math.PI * 2);
              ctx.fill();
            }
            break;
          case "special":
            // Специальные блоки с уникальным внешним видом
            ctx.fillStyle = getBockColor(selectedBlock);
            ctx.beginPath();
            const centerX = blockXPos + blockSize/2;
            const centerY = blockYPos + blockSize/2;
            
            if (selectedBlock.name === "Пружина") {
              // Пружина
              for (let i = 0; i < 5; i++) {
                const y = blockYPos + i * blockSize/5;
                const width = blockSize * (0.6 + 0.4 * Math.sin(i * Math.PI));
                ctx.fillRect(blockXPos + (blockSize - width)/2, y, width, blockSize/10);
              }
            } else if (selectedBlock.name === "Магнит") {
              // Магнит
              ctx.arc(centerX, centerY, blockSize/2, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "red";
              ctx.fillRect(centerX - blockSize/4, blockYPos, blockSize/2, blockSize/4);
            } else {
              // Остальные специальные
              ctx.arc(centerX, centerY, blockSize/2, 0, Math.PI * 2);
              ctx.fill();
            }
            break;
        }
        
        // Отображение иконки
        ctx.font = `${blockSize/2}px Arial`;
        ctx.fillText(selectedBlock.icon, blockXPos + blockSize/4, blockYPos + blockSize*0.7);
        
      } else {
        // Анимация фрагментов
        for (let i = 0; i < fragments.length; i++) {
          const f = fragments[i];
          f.vy += gravity * 0.5;
          f.x += f.vx;
          f.y += f.vy;
          
          // Отскок от стен
          if (f.x < 0 || f.x > canvas.width) f.vx = -f.vx * 0.8;
          
          // Отскок от пола
          if (f.y + f.size > canvas.height) {
            f.y = canvas.height - f.size;
            f.vy = -f.vy * bounce * 0.8;
            f.vx *= (1 - friction * 0.1);
          }
          
          // Отрисовка фрагмента
          ctx.fillStyle = getBockColor(selectedBlock);
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Продолжаем анимацию, если симуляция запущена
      if (simulationRunning) {
        requestAnimationFrame(animate);
      }
    };
    
    // Запуск анимации
    animate();
  };
  
  // Получить цвет блока по его типу
  const getBockColor = (block: BlockType): string => {
    switch (block.type) {
      case "solid": return "#3B82F6";  // Синий
      case "liquid": return "#06B6D4"; // Голубой
      case "powder": return "#F59E0B"; // Оранжевый
      case "special": return "#8B5CF6"; // Фиолетовый
      default: return "#71717A";       // Серый
    }
  };
  
  // Обработка изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.clientWidth;
        canvasRef.current.height = canvasRef.current.clientHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>🧪</span>
          <span>Симулятор физики блоков</span>
        </h1>
        <ThemeToggle />
      </header>
      
      <Separator className="my-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {/* Панель настроек */}
        {showSettings && (
          <div className="md:col-span-1 space-y-6">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Выберите блок</h2>
              <BlockSelector 
                onSelectBlock={setSelectedBlock}
                selectedBlock={selectedBlock}
              />
            </Card>
            
            {selectedBlock && (
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Настройки блока</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Тип: {selectedBlock.type === "solid" ? "Твердый" :
                        selectedBlock.type === "liquid" ? "Жидкость" :
                        selectedBlock.type === "powder" ? "Сыпучий" : "Особый"}
                </p>
                <p className="text-sm mb-4">{selectedBlock.description}</p>
                <PhysicsControls
                  block={selectedBlock}
                  onUpdateProperties={handleUpdateProperties}
                  graphicsQuality={graphicsQuality}
                  onUpdateGraphicsQuality={setGraphicsQuality}
                />
              </Card>
            )}
          </div>
        )}
        
        {/* Область симуляции */}
        <div className={`${showSettings ? 'md:col-span-2' : 'md:col-span-3'} flex flex-col`}>
          <Card className="flex-1 overflow-hidden relative bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-2">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full"
              style={{ minHeight: '500px' }}
            ></canvas>
            
            {/* Управление симуляцией */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {!simulationRunning ? (
                <>
                  <Button 
                    variant="default" 
                    size="lg" 
                    onClick={startSimulation}
                    disabled={!selectedBlock}
                    className="flex items-center gap-2"
                  >
                    <PlayCircle className="h-5 w-5" />
                    Запустить симуляцию
                  </Button>
                  
                  {!showSettings && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowSettings(true)}
                    >
                      <Settings2 className="h-5 w-5" />
                    </Button>
                  )}
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={resetSimulation}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  Сбросить
                </Button>
              )}
            </div>
            
            {/* Инструкция, когда нет выбранного блока */}
            {!selectedBlock && !simulationRunning && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-xl mb-2">👈 Выберите блок слева</p>
                <p className="text-muted-foreground">Настройте его физические свойства и запустите симуляцию</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
