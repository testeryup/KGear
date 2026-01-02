"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"

const API_BASE_URL = "https://localhost:7111"

// Image preview type
interface ImagePreview {
  file: File
  url: string
}

const variantSchema = z.object({
  sku: z
    .string()
    .min(1, "SKU is required.")
    .max(50, "SKU must be at most 50 characters."),
  name: z
    .string()
    .min(1, "Variant name is required.")
    .max(100, "Variant name must be at most 100 characters."),
  price: z
    .number({ message: "Price is required." })
    .min(0, "Price must be at least 0.")
    .max(1000000, "Price must be at most 1,000,000."),
  stock: z
    .number({ message: "Stock is required." })
    .min(0, "Stock must be at least 0.")
    .max(1000000, "Stock must be at most 1,000,000."),
  images: z
    .custom<FileList>()
    .optional(),
})

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required.")
    .max(100, "Product name must be at most 100 characters."),
  description: z
    .string()
    .min(1, "Description is required.")
    .max(500, "Description must be at most 500 characters."),
  brandName: z
    .string()
    .min(1, "Brand name is required.")
    .max(50, "Brand name must be at most 50 characters."),
  variants: z
    .array(variantSchema)
    .min(1, "At least one variant is required."),
})

type FormData = z.infer<typeof formSchema>

export function ProductForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [variantImages, setVariantImages] = React.useState<Map<number, ImagePreview[]>>(new Map())
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      brandName: "",
      variants: [
        {
          sku: "",
          name: "",
          price: 0,
          stock: 0,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  })

  // Handle image selection for a variant
  const handleImageChange = (variantIndex: number, files: FileList | null) => {
    if (!files) return
    
    const newImages: ImagePreview[] = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    
    setVariantImages((prev) => {
      const updated = new Map(prev)
      const existing = updated.get(variantIndex) || []
      updated.set(variantIndex, [...existing, ...newImages])
      return updated
    })
  }

  // Remove a single image from a variant
  const removeImage = (variantIndex: number, imageIndex: number) => {
    setVariantImages((prev) => {
      const updated = new Map(prev)
      const existing = updated.get(variantIndex) || []
      // Revoke the object URL to free memory
      URL.revokeObjectURL(existing[imageIndex].url)
      existing.splice(imageIndex, 1)
      updated.set(variantIndex, [...existing])
      return updated
    })
  }

  // Remove variant and clean up its images
  const removeVariant = (index: number) => {
    // Clean up image URLs
    const images = variantImages.get(index) || []
    images.forEach((img) => URL.revokeObjectURL(img.url))
    
    // Reindex the remaining variants' images
    setVariantImages((prev) => {
      const updated = new Map<number, ImagePreview[]>()
      prev.forEach((value, key) => {
        if (key < index) {
          updated.set(key, value)
        } else if (key > index) {
          updated.set(key - 1, value)
        }
      })
      return updated
    })
    
    remove(index)
  }

  async function onSubmit(data: FormData) {
    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      
      // Add product fields
      formData.append("Name", data.name)
      formData.append("Description", data.description)
      formData.append("BrandName", data.brandName)
      
      // Add variants
      data.variants.forEach((variant, index) => {
        formData.append(`Variants[${index}].SKU`, variant.sku)
        formData.append(`Variants[${index}].Name`, variant.name)
        formData.append(`Variants[${index}].Price`, variant.price.toString())
        formData.append(`Variants[${index}].Stock`, variant.stock.toString())
        
        // Add images for this variant from our state
        const images = variantImages.get(index) || []
        images.forEach((img) => {
          formData.append(`Variants[${index}].Images`, img.file)
        })
      })

      const response = await fetch(`${API_BASE_URL}/product/create`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      toast.success("Product created successfully!", {
        description: (
          <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            <code>{JSON.stringify(result, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
      })
      
      // Clear images and reset form
      variantImages.forEach((images) => {
        images.forEach((img) => URL.revokeObjectURL(img.url))
      })
      setVariantImages(new Map())
      form.reset()
    } catch (error) {
      console.error("Submit error:", error)
      toast.error("Failed to create product", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
        position: "bottom-right",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
        <CardDescription>
          Add a new product with variants and images.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="product-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Product Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
                  <Input
                    {...field}
                    id="product-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Gaming Keyboard"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-description">
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="product-description"
                      placeholder="A high-quality mechanical gaming keyboard..."
                      rows={4}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/500 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Brand Name */}
            <Controller
              name="brandName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="brand-name">Brand Name</FieldLabel>
                  <Input
                    {...field}
                    id="brand-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Logitech"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Separator className="my-4" />

            {/* Variants Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Variants</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      sku: "",
                      name: "",
                      price: 0,
                      stock: 0,
                    })
                  }
                >
                  + Add Variant
                </Button>
              </div>

              {fields.map((variantField, index) => (
                <Card key={variantField.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Variant {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeVariant(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <FieldGroup>
                    {/* SKU */}
                    <Controller
                      name={`variants.${index}.sku`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`variant-sku-${index}`}>
                            SKU
                          </FieldLabel>
                          <Input
                            {...field}
                            id={`variant-sku-${index}`}
                            aria-invalid={fieldState.invalid}
                            placeholder="KB-001-BLK"
                            autoComplete="off"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    {/* Variant Name */}
                    <Controller
                      name={`variants.${index}.name`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={`variant-name-${index}`}>
                            Variant Name
                          </FieldLabel>
                          <Input
                            {...field}
                            id={`variant-name-${index}`}
                            aria-invalid={fieldState.invalid}
                            placeholder="Black - Full Size"
                            autoComplete="off"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      {/* Price */}
                      <Controller
                        name={`variants.${index}.price`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`variant-price-${index}`}>
                              Price
                            </FieldLabel>
                            <Input
                              {...field}
                              id={`variant-price-${index}`}
                              type="number"
                              step="0.01"
                              min="0"
                              aria-invalid={fieldState.invalid}
                              placeholder="99.99"
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      {/* Stock */}
                      <Controller
                        name={`variants.${index}.stock`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`variant-stock-${index}`}>
                              Stock
                            </FieldLabel>
                            <Input
                              {...field}
                              id={`variant-stock-${index}`}
                              type="number"
                              min="0"
                              aria-invalid={fieldState.invalid}
                              placeholder="100"
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    {/* Images */}
                    <Field>
                      <FieldLabel htmlFor={`variant-images-${index}`}>
                        Images
                      </FieldLabel>
                      <Input
                        id={`variant-images-${index}`}
                        type="file"
                        multiple
                        accept="image/*"
                        className="cursor-pointer"
                        onChange={(e) => handleImageChange(index, e.target.files)}
                      />
                      <FieldDescription>
                        Select one or more images for this variant.
                      </FieldDescription>
                      
                      {/* Image Previews */}
                      {variantImages.get(index)?.length ? (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                          {variantImages.get(index)?.map((img, imgIndex) => (
                            <div
                              key={imgIndex}
                              className="relative group rounded-lg overflow-hidden border bg-muted aspect-square"
                            >
                              <img
                                src={img.url}
                                alt={`Preview ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index, imgIndex)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                                aria-label="Remove image"
                              >
                                ✕
                              </button>
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-1 py-0.5 truncate">
                                {img.file.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </Field>
                  </FieldGroup>
                </Card>
              ))}

              {form.formState.errors.variants?.message && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.variants.message}
                </p>
              )}
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" form="product-form" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
