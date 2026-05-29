import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <Input 
  placeholder="Ex-3" 
  type="number"
  onChange={(e) =>
    setFormData({
      ...formData,
      days: e.target.value
            })
          }
    />
  );
}

export { Input }
