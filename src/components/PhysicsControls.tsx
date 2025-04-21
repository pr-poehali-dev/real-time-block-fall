
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { BlockType } from "./BlockSelector";

type PhysicsControlsProps = {
  block: BlockType;
  onUpdateProperties: (properties: BlockType["properties"]) => void;
  graphicsQuality: number;
  onUpdateGraphicsQuality: (value: number) => void;
};

export function PhysicsControls({ 
  block, 
  onUpdateProperties,
  graphicsQuality,
  onUpdateGraphicsQuality
}: PhysicsControlsProps) {
  const handlePropertyChange = (property: keyof BlockType["properties"], value: number[]) => {
    onUpdateProperties({
      ...block.properties,
      [property]: value[0]
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Физические свойства</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="density">Плотность</Label>
              <span className="text-sm text-muted-foreground">
                {Math.round(block.properties.density * 100)}%
              </span>
            </div>
            <Slider 
              id="density"
              min={0.1} 
              max={1} 
              step={0.01} 
              value={[block.properties.density]} 
              onValueChange={(value) => handlePropertyChange("density", value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="restitution">Упругость</Label>
              <span className="text-sm text-muted-foreground">
                {Math.round(block.properties.restitution * 100)}%
              </span>
            </div>
            <Slider 
              id="restitution"
              min={0} 
              max={1} 
              step={0.01} 
              value={[block.properties.restitution]} 
              onValueChange={(value) => handlePropertyChange("restitution", value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="friction">Трение</Label>
              <span className="text-sm text-muted-foreground">
                {Math.round(block.properties.friction * 100)}%
              </span>
            </div>
            <Slider 
              id="friction"
              min={0} 
              max={1} 
              step={0.01} 
              value={[block.properties.friction]} 
              onValueChange={(value) => handlePropertyChange("friction", value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="fragility">Хрупкость</Label>
              <span className="text-sm text-muted-foreground">
                {Math.round(block.properties.fragility * 100)}%
              </span>
            </div>
            <Slider 
              id="fragility"
              min={0} 
              max={1} 
              step={0.01} 
              value={[block.properties.fragility]} 
              onValueChange={(value) => handlePropertyChange("fragility", value)}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Графика</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="graphics">Качество графики</Label>
            <span className="text-sm text-muted-foreground">
              {graphicsQuality < 0.3 
                ? "Низкое" 
                : graphicsQuality < 0.7 
                ? "Среднее" 
                : "Высокое"}
            </span>
          </div>
          <Slider 
            id="graphics"
            min={0.1} 
            max={1} 
            step={0.01} 
            value={[graphicsQuality]} 
            onValueChange={(value) => onUpdateGraphicsQuality(value[0])}
          />
        </div>
      </div>
    </div>
  );
}
