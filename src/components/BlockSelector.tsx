
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type BlockType = {
  id: number;
  name: string;
  icon: string;
  description: string;
  type: "solid" | "liquid" | "powder" | "special";
  properties: {
    density: number;
    restitution: number;
    friction: number;
    fragility: number;
  };
};

const blockTypes: BlockType[] = [
  // Твердые блоки
  { 
    id: 1, 
    name: "Камень", 
    icon: "🪨", 
    description: "Тяжелый, твердый камень",
    type: "solid",
    properties: { density: 0.8, restitution: 0.3, friction: 0.7, fragility: 0.1 }
  },
  { 
    id: 2, 
    name: "Дерево", 
    icon: "🪵", 
    description: "Деревянный блок средней плотности",
    type: "solid",
    properties: { density: 0.5, restitution: 0.4, friction: 0.6, fragility: 0.3 }
  },
  { 
    id: 3, 
    name: "Металл", 
    icon: "🔩", 
    description: "Тяжелый металлический блок",
    type: "solid",
    properties: { density: 0.9, restitution: 0.6, friction: 0.4, fragility: 0.05 }
  },
  { 
    id: 4, 
    name: "Стекло", 
    icon: "💎", 
    description: "Хрупкий стеклянный блок",
    type: "solid",
    properties: { density: 0.6, restitution: 0.2, friction: 0.3, fragility: 0.9 }
  },
  { 
    id: 5, 
    name: "Резина", 
    icon: "🏀", 
    description: "Упругий резиновый блок",
    type: "solid",
    properties: { density: 0.4, restitution: 0.8, friction: 0.8, fragility: 0.1 }
  },
  
  // Сыпучие материалы
  { 
    id: 6, 
    name: "Песок", 
    icon: "🏝️", 
    description: "Рассыпается при ударе",
    type: "powder",
    properties: { density: 0.7, restitution: 0.1, friction: 0.9, fragility: 0.7 }
  },
  { 
    id: 7, 
    name: "Гравий", 
    icon: "🌋", 
    description: "Мелкие камешки",
    type: "powder",
    properties: { density: 0.65, restitution: 0.25, friction: 0.8, fragility: 0.5 }
  },
  { 
    id: 8, 
    name: "Снег", 
    icon: "❄️", 
    description: "Легкий, рассыпчатый снег",
    type: "powder",
    properties: { density: 0.2, restitution: 0.1, friction: 0.4, fragility: 0.8 }
  },
  
  // Жидкости
  { 
    id: 9, 
    name: "Вода", 
    icon: "💧", 
    description: "Разливается при ударе",
    type: "liquid",
    properties: { density: 0.6, restitution: 0.05, friction: 0.1, fragility: 0.9 }
  },
  { 
    id: 10, 
    name: "Лава", 
    icon: "🔥", 
    description: "Вязкая, горячая жидкость",
    type: "liquid",
    properties: { density: 0.75, restitution: 0.1, friction: 0.3, fragility: 0.7 }
  },
  { 
    id: 11, 
    name: "Масло", 
    icon: "🫒", 
    description: "Скользкая жидкость",
    type: "liquid",
    properties: { density: 0.5, restitution: 0.03, friction: 0.05, fragility: 0.8 }
  },
  
  // Специальные блоки
  { 
    id: 12, 
    name: "Пружина", 
    icon: "🔄", 
    description: "Сильно отскакивает",
    type: "special",
    properties: { density: 0.3, restitution: 0.95, friction: 0.4, fragility: 0.2 }
  },
  { 
    id: 13, 
    name: "Взрывчатка", 
    icon: "💣", 
    description: "Взрывается при сильном ударе",
    type: "special",
    properties: { density: 0.5, restitution: 0.3, friction: 0.5, fragility: 0.8 }
  },
  { 
    id: 14, 
    name: "Магнит", 
    icon: "🧲", 
    description: "Притягивает металлические блоки",
    type: "special",
    properties: { density: 0.7, restitution: 0.4, friction: 0.6, fragility: 0.3 }
  },
  { 
    id: 15, 
    name: "Лед", 
    icon: "🧊", 
    description: "Скользкий и хрупкий",
    type: "solid",
    properties: { density: 0.4, restitution: 0.3, friction: 0.1, fragility: 0.7 }
  },
  { 
    id: 16, 
    name: "Облако", 
    icon: "☁️", 
    description: "Очень легкое, медленно падает",
    type: "special",
    properties: { density: 0.1, restitution: 0.2, friction: 0.3, fragility: 0.6 }
  },
  { 
    id: 17, 
    name: "Губка", 
    icon: "🧽", 
    description: "Поглощает жидкости",
    type: "special",
    properties: { density: 0.2, restitution: 0.3, friction: 0.7, fragility: 0.4 }
  },
  { 
    id: 18, 
    name: "Слизь", 
    icon: "🦠", 
    description: "Отскакивает и растекается",
    type: "special",
    properties: { density: 0.4, restitution: 0.7, friction: 0.6, fragility: 0.5 }
  },
  { 
    id: 19, 
    name: "Бетон", 
    icon: "🧱", 
    description: "Очень тяжелый и твердый",
    type: "solid",
    properties: { density: 0.95, restitution: 0.2, friction: 0.8, fragility: 0.15 }
  },
  { 
    id: 20, 
    name: "Пена", 
    icon: "🫧", 
    description: "Легкая и пористая",
    type: "special",
    properties: { density: 0.15, restitution: 0.5, friction: 0.4, fragility: 0.6 }
  },
];

type BlockSelectorProps = {
  onSelectBlock: (block: BlockType) => void;
  selectedBlock: BlockType | null;
};

export function BlockSelector({ onSelectBlock, selectedBlock }: BlockSelectorProps) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid grid-cols-5 mb-4">
        <TabsTrigger value="all">Все</TabsTrigger>
        <TabsTrigger value="solid">Твердые</TabsTrigger>
        <TabsTrigger value="powder">Сыпучие</TabsTrigger>
        <TabsTrigger value="liquid">Жидкости</TabsTrigger>
        <TabsTrigger value="special">Особые</TabsTrigger>
      </TabsList>
      
      {["all", "solid", "powder", "liquid", "special"].map((tabValue) => (
        <TabsContent key={tabValue} value={tabValue} className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {blockTypes
              .filter(block => tabValue === "all" || block.type === tabValue)
              .map(block => (
                <Button
                  key={block.id}
                  variant={selectedBlock?.id === block.id ? "default" : "outline"}
                  className={`h-24 flex flex-col items-center justify-center gap-1 ${
                    selectedBlock?.id === block.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => onSelectBlock(block)}
                >
                  <span className="text-2xl">{block.icon}</span>
                  <span className="text-sm font-medium">{block.name}</span>
                </Button>
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
