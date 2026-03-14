// app/input/page.tsx
'use client'

import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Trash2, Upload, Download, FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx'
import { exportToXLSX } from '@/lib/export'

import { cn } from '@/lib/utils'
import { useFinancialStore } from '@/store/financialStore'
import { Category, FinancialEntry } from '@/types/financial'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// Zod schema for form validation
const formSchema = z.object({
  date: z.date(),
  category: z.nativeEnum(Category),
  subcategory: z.string().optional(),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  description: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const categoryColors: Record<Category, string> = {
  [Category.REVENUE]: 'bg-green-100/50 dark:bg-green-900/20',
  [Category.COGS]: 'bg-red-100/50 dark:bg-red-900/20',
  [Category.OPEX]: 'bg-orange-100/50 dark:bg-orange-900/20',
  [Category.SALARY]: 'bg-amber-100/50 dark:bg-amber-900/20',
  [Category.ASSET]: 'bg-blue-100/50 dark:bg-blue-900/20',
  [Category.LIABILITY]: 'bg-purple-100/50 dark:bg-purple-900/20',
  [Category.EQUITY]: 'bg-teal-100/50 dark:bg-teal-900/20',
  [Category.CAPEX]: 'bg-indigo-100/50 dark:bg-indigo-900/20',
  [Category.DA]: 'bg-gray-100/50 dark:bg-gray-900/20',
  [Category.INTEREST]: 'bg-yellow-100/50 dark:bg-yellow-900/20',
  [Category.TAX]: 'bg-pink-100/50 dark:bg-pink-900/20',
}

export default function InputPage() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { entries, addEntry, removeEntry, clearAllEntries } = useFinancialStore()

  const handleExport = () => {
    const data = entries.map(entry => ({
      [t('date')]: format(new Date(entry.date), 'yyyy-MM-dd'),
      [t('category')]: entry.category,
      [t('subcategory')]: entry.subcategory,
      [t('amount')]: entry.amount,
      [t('description')]: entry.description,
    }))
    exportToXLSX(data, 'Financial_Entries', 'Entries')
  }

  const downloadTemplate = () => {
    const templateData = [
      {
        date: '2024-03-01',
        category: Category.REVENUE,
        subcategory: 'Sales',
        amount: 5000,
        description: 'Monthly sales revenue'
      },
      {
        date: '2024-03-05',
        category: Category.OPEX,
        subcategory: 'Rent',
        amount: 1200,
        description: 'Office rent'
      },
      {
        date: '2024-03-10',
        category: Category.SALARY,
        subcategory: 'Engineering',
        amount: 3000,
        description: 'Developer salary'
      }
    ]
    exportToXLSX(templateData, 'Financial_Entries_Template', 'Template')
  }

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  const onSubmit = (data: FormData) => {
    const newEntry: Omit<FinancialEntry, 'id'> = {
      ...data,
      category: data.category,
      subcategory: data.subcategory || '',
      description: data.description || '',
      amount: Number(data.amount),
      date: data.date.toISOString(),
    }
    addEntry(newEntry)
    reset()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const bstr = evt.target?.result
      const wb = XLSX.read(bstr, { type: 'binary' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_json(ws) as any[]

      data.forEach((row) => {
        // Basic validation and mapping
        if (row.date && row.category && row.amount) {
          const newEntry: Omit<FinancialEntry, 'id'> = {
            date: new Date(row.date).toISOString(),
            category: row.category as Category,
            subcategory: row.subcategory || '',
            amount: Number(row.amount),
            description: row.description || '',
          }
          addEntry(newEntry)
        }
      })
    }
    reader.readAsBinaryString(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('data_input')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('add_new_entry')}</CardTitle>
          <CardDescription>{t('fill_out_the_form_to_add_a_financial_record')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Date Picker */}
            <div className="flex flex-col space-y-1.5">
              <label>{t('date')}</label>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, 'PPP') : <span>{t('pick_a_date')}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
            </div>

            {/* Category Select */}
            <div className="flex flex-col space-y-1.5">
              <label>{t('category')}</label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_category')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Category).map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
            </div>

            {/* Subcategory Input */}
            <div className="flex flex-col space-y-1.5">
              <label>{t('subcategory')}</label>
              <Input {...register('subcategory')} placeholder={t('e_g_salaries')} />
            </div>

            {/* Amount Input */}
            <div className="flex flex-col space-y-1.5">
              <label>{t('amount')}</label>
              <Input {...register('amount')} type="number" step="0.01" placeholder="0.00" />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col space-y-1.5 md:col-span-2 lg:col-span-full">
              <label>{t('description')}</label>
              <Textarea {...register('description')} placeholder={t('optional_description')} />
            </div>

            <Button type="submit" className="lg:col-start-5">{t('add_entry')}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('existing_entries')}</CardTitle>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx, .xls"
              className="hidden"
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              {t('import_xlsx')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={entries.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              {t('export_xlsx')}
            </Button>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              {t('download_template')}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={entries.length === 0}>{t('clear_all')}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('are_you_sure')}</AlertDialogTitle>
                  <AlertDialogDescription>{t('this_action_cannot_be_undone')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => { clearAllEntries() }}>{t('continue')}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('category')}</TableHead>
                  <TableHead>{t('subcategory')}</TableHead>
                  <TableHead className="text-right">{t('amount')}</TableHead>
                  <TableHead>{t('description')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <TableRow key={entry.id} className={categoryColors[entry.category]}>
                      <TableCell>{format(new Date(entry.date), 'yyyy-MM-dd')}</TableCell>
                      <TableCell><span className="font-mono text-xs">{entry.category}</span></TableCell>
                      <TableCell>{entry.subcategory}</TableCell>
                      <TableCell className="text-right font-medium">{entry.amount.toFixed(2)}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => removeEntry(entry.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">{t('no_entries_found')}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}