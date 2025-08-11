import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Scale, Package } from "lucide-react";
import { Product } from "@/lib/data";
import { 
  getWeightCalculation, 
  formatWeight, 
  validateWeightQuantity,
  getWeightQuantityOptions,
  calculateWeightPrice,
  checkWeightStock
} from "@/lib/weight-utils";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  currentCartQuantity?: number;
  disabled?: boolean;
  showPrice?: boolean;
  size?: "sm" | "md" | "lg";
  mode?: "buttons" | "input" | "select";
}

export function QuantitySelector({
  product,
  quantity,
  onQuantityChange,
  currentCartQuantity = 0,
  disabled = false,
  showPrice = true,
  size = "md",
  mode = "buttons"
}: QuantitySelectorProps) {
  const [inputValue, setInputValue] = useState(quantity.toString());
  const [error, setError] = useState<string>("");
  
  const calculation = getWeightCalculation(product);
  const stockCheck = checkWeightStock(product, quantity, currentCartQuantity);
  const totalPrice = calculateWeightPrice(product.price, quantity, product.unit);
  
  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 0) return;
    
    // Validate quantity
    const validation = validateWeightQuantity(newQuantity, product);
    
    if (!validation.isValid && validation.adjustedQuantity !== undefined) {
      setError(validation.errorMessage || "");
      onQuantityChange(validation.adjustedQuantity);
      return;
    }
    
    // Check stock
    const stockValidation = checkWeightStock(product, newQuantity, currentCartQuantity);
    if (!stockValidation.hasStock) {
      setError(stockValidation.errorMessage || "Stock insuficiente");
      if (stockValidation.availableQuantity > 0) {
        onQuantityChange(stockValidation.availableQuantity);
      }
      return;
    }
    
    setError("");
    onQuantityChange(newQuantity);
  };

  const incrementQuantity = () => {
    const increment = calculation.isWeightBased ? calculation.minWeightStep : 1;
    handleQuantityChange(quantity + increment);
  };

  const decrementQuantity = () => {
    const decrement = calculation.isWeightBased ? calculation.minWeightStep : 1;
    handleQuantityChange(Math.max(0, quantity - decrement));
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      handleQuantityChange(numValue);
    }
  };

  const sizeClasses = {
    sm: {
      button: "h-6 w-6 text-xs",
      input: "h-6 text-xs",
      text: "text-xs"
    },
    md: {
      button: "h-8 w-8 text-sm",
      input: "h-8 text-sm",
      text: "text-sm"
    },
    lg: {
      button: "h-10 w-10 text-base",
      input: "h-10 text-base",
      text: "text-base"
    }
  };

  const classes = sizeClasses[size];

  if (mode === "select") {
    const options = getWeightQuantityOptions(product);
    
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {calculation.isWeightBased ? (
            <Scale className="h-4 w-4 text-gray-500" />
          ) : (
            <Package className="h-4 w-4 text-gray-500" />
          )}
          <Select
            value={quantity.toString()}
            onValueChange={(value) => handleQuantityChange(parseFloat(value))}
            disabled={disabled}
          >
            <SelectTrigger className={cn(classes.input, "w-full")}>
              <SelectValue placeholder="Seleccionar cantidad" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {showPrice && (
          <div className={cn("font-medium text-green-600", classes.text)}>
            ${totalPrice.toFixed(2)}
          </div>
        )}
        
        {error && (
          <Badge variant="destructive" className="text-xs">
            {error}
          </Badge>
        )}
      </div>
    );
  }

  if (mode === "input") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {calculation.isWeightBased ? (
            <Scale className="h-4 w-4 text-gray-500" />
          ) : (
            <Package className="h-4 w-4 text-gray-500" />
          )}
          <Input
            type="number"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className={cn(classes.input, "w-24 text-center")}
            disabled={disabled}
            step={calculation.minWeightStep}
            min={calculation.minWeightStep}
            placeholder={calculation.isWeightBased ? "0.1" : "1"}
          />
          <span className={cn("text-gray-500", classes.text)}>
            {calculation.displayUnit}
          </span>
        </div>
        
        {showPrice && (
          <div className={cn("font-medium text-green-600", classes.text)}>
            ${totalPrice.toFixed(2)}
          </div>
        )}
        
        {error && (
          <Badge variant="destructive" className="text-xs">
            {error}
          </Badge>
        )}
      </div>
    );
  }

  // Default: buttons mode
  return (
    <div className="space-y-2" role="group" aria-label="Selector de cantidad">
      <div className="flex items-center gap-1">
        {calculation.isWeightBased ? (
          <Scale className="h-3 w-3 text-gray-500 mr-1" aria-hidden="true" />
        ) : (
          <Package className="h-3 w-3 text-gray-500 mr-1" aria-hidden="true" />
        )}

        <Button
          variant="outline"
          size="sm"
          className={cn(classes.button, "rounded-full")}
          onClick={decrementQuantity}
          disabled={disabled || quantity <= (calculation.isWeightBased ? calculation.minWeightStep : 1)}
          aria-label={`Disminuir cantidad de ${product.name}`}
          aria-describedby={`quantity-display-${product.id}`}
        >
          <Minus className="h-3 w-3" aria-hidden="true" />
        </Button>
        
        <div
          className={cn("min-w-[3rem] text-center font-medium", classes.text)}
          id={`quantity-display-${product.id}`}
          aria-live="polite"
          aria-label={`Cantidad actual: ${calculation.isWeightBased
            ? formatWeight(quantity, product.unit)
            : `${quantity} ${product.unit}${quantity !== 1 ? 's' : ''}`
          }`}
        >
          {calculation.isWeightBased
            ? formatWeight(quantity, product.unit)
            : `${quantity} ${product.unit}${quantity !== 1 ? 's' : ''}`
          }
        </div>

        <Button
          variant="outline"
          size="sm"
          className={cn(classes.button, "rounded-full")}
          onClick={incrementQuantity}
          disabled={disabled || !stockCheck.hasStock}
          aria-label={`Aumentar cantidad de ${product.name}`}
          aria-describedby={`quantity-display-${product.id}`}
        >
          <Plus className="h-3 w-3" aria-hidden="true" />
        </Button>
      </div>
      
      {showPrice && (
        <div className={cn("font-medium text-green-600 text-center", classes.text)}>
          ${totalPrice.toFixed(2)}
        </div>
      )}
      
      {calculation.isWeightBased && (
        <div className="text-xs text-gray-500 text-center">
          ${product.price}/{product.unit}
        </div>
      )}
      
      {error && (
        <Badge variant="destructive" className="text-xs w-full justify-center">
          {error}
        </Badge>
      )}
      
      {!stockCheck.hasStock && !error && (
        <Badge variant="outline" className="text-xs w-full justify-center text-orange-600">
          Stock: {formatWeight(stockCheck.availableQuantity, product.unit)}
        </Badge>
      )}
    </div>
  );
}

export default QuantitySelector;
