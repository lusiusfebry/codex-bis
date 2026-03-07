import { useEffect, useMemo, useState } from "react";
import { Controller, type DefaultValues, type Path, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { createMasterData, updateMasterData } from "@/api/masterData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toastError, toastSuccess } from "@/lib/toast";

export type BaseFormValues = Record<string, string>;

type SelectOption = {
  label: string;
  value: string;
};

type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "switch" | "select" | "color";
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
};

type BaseMasterDataFormModalProps<T extends { id: string }, F extends BaseFormValues> = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: T;
  resourcePath: string;
  title: string;
  description: string;
  fields: FieldConfig[];
  defaultValues: F;
  mapInitialData: (data?: T) => F;
  buildPayload: (values: F) => Record<string, unknown>;
  successMessages: {
    create: string;
    update: string;
  };
};

export function BaseMasterDataFormModal<T extends { id: string }, F extends BaseFormValues>({
  open,
  onClose,
  onSuccess,
  initialData,
  resourcePath,
  title,
  description,
  fields,
  defaultValues,
  mapInitialData,
  buildPayload,
  successMessages,
}: BaseMasterDataFormModalProps<T, F>) {
  const [submitting, setSubmitting] = useState(false);
  const isEditMode = Boolean(initialData);

  const resolvedValues = useMemo(() => mapInitialData(initialData), [initialData, mapInitialData]);

  const form = useForm<F>({
    defaultValues: defaultValues as DefaultValues<F>,
  });

  useEffect(() => {
    form.reset(resolvedValues as DefaultValues<F>);
  }, [form, resolvedValues]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);

    try {
      const payload = buildPayload(values as F);

      if (isEditMode && initialData) {
        await updateMasterData(resourcePath, initialData.id, payload);
        toastSuccess(successMessages.update);
      } else {
        await createMasterData(resourcePath, payload);
        toastSuccess(successMessages.create);
      }

      onSuccess();
      onClose();
    } catch (error) {
      toastError(error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Dialog onOpenChange={(nextOpen) => !nextOpen && onClose()} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? `Edit ${title}` : `Tambah ${title}`}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {fields.map((field) => {
              const fieldName = field.name as Path<F>;
              const fieldError = form.formState.errors[field.name]?.message as string | undefined;

              if (field.type === "switch") {
                return (
                  <Controller
                    control={form.control}
                    key={field.name}
                    name={fieldName}
                    render={({ field: controllerField }) => (
                      <div className="flex flex-row items-center justify-between rounded-xl border p-4">
                        <div className="space-y-1">
                          <Label>{field.label}</Label>
                          <p className="text-sm text-muted-foreground">Aktifkan untuk membuat data tersedia di seluruh sistem.</p>
                        </div>
                        <Switch
                          checked={controllerField.value === "Aktif"}
                          onCheckedChange={(checked) => controllerField.onChange(checked ? "Aktif" : "Tidak Aktif")}
                        />
                      </div>
                    )}
                  />
                );
              }

              if (field.type === "select") {
                return (
                  <div className="space-y-2" key={field.name}>
                    <Label>{field.label}</Label>
                    <Controller
                      control={form.control}
                      name={fieldName}
                      rules={field.required ? { required: `${field.label} wajib diisi.` } : undefined}
                      render={({ field: controllerField }) => (
                        <Select onValueChange={controllerField.onChange} value={String(controllerField.value ?? "")}>
                          <SelectTrigger>
                            <SelectValue placeholder={field.placeholder ?? `Pilih ${field.label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {(field.options ?? []).map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {fieldError ? <p className="text-sm font-medium text-destructive">{fieldError}</p> : null}
                  </div>
                );
              }

              if (field.type === "textarea") {
                return (
                  <div className="space-y-2" key={field.name}>
                    <Label>{field.label}</Label>
                    <Textarea
                      placeholder={field.placeholder}
                      {...form.register(fieldName, field.required ? { required: `${field.label} wajib diisi.` } : undefined)}
                    />
                    {fieldError ? <p className="text-sm font-medium text-destructive">{fieldError}</p> : null}
                  </div>
                );
              }

              if (field.type === "color") {
                return (
                  <div className="space-y-2" key={field.name}>
                    <Label>{field.label}</Label>
                    <Controller
                      control={form.control}
                      name={fieldName}
                      rules={field.required ? { required: `${field.label} wajib diisi.` } : undefined}
                      render={({ field: controllerField }) => (
                        <div className="flex items-center gap-3">
                          <Input
                            className="h-12 w-20 p-1"
                            onChange={controllerField.onChange}
                            type="color"
                            value={String(controllerField.value ?? "#1B2A47")}
                          />
                          <Input onChange={controllerField.onChange} value={String(controllerField.value ?? "#1B2A47")} />
                        </div>
                      )}
                    />
                    {fieldError ? <p className="text-sm font-medium text-destructive">{fieldError}</p> : null}
                  </div>
                );
              }

              return (
                <div className="space-y-2" key={field.name}>
                  <Label>{field.label}</Label>
                  <Input
                    placeholder={field.placeholder}
                    {...form.register(fieldName, field.required ? { required: `${field.label} wajib diisi.` } : undefined)}
                  />
                  {fieldError ? <p className="text-sm font-medium text-destructive">{fieldError}</p> : null}
                </div>
              );
            })}
            <DialogFooter>
              <Button onClick={onClose} type="button" variant="outline">
                Batal
              </Button>
              <Button disabled={submitting} type="submit">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isEditMode ? "Simpan Perubahan" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
