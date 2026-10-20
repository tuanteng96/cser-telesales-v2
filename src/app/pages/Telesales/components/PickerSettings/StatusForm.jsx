import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useFieldArray, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import ConfigAPI from 'src/app/_ezs/api/config.api'
import { Button } from 'src/app/_ezs/partials/button'
import { parseStatusValue, serializeStatusValues } from './statusValues.js'

function StatusForm({ value, onClose }) {
  const queryClient = useQueryClient()
  const { control, register, handleSubmit, setError, formState: { errors } } = useForm({
    defaultValues: { items: parseStatusValue(value) }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const saveMutation = useMutation({
    mutationFn: async (body) => {
      const result = await ConfigAPI.saveName({ name: 'kqtele', body })
      if (result.data?.error) throw new Error(result.data.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['TelesalesSettings', 'kqtele'] })
      window.top?.toastr?.success('Lưu trạng thái Telesales thành công.', '', { timeOut: 1500 })
      onClose()
    },
    onError: () => setError('root', { message: 'Không thể lưu trạng thái. Vui lòng thử lại.' })
  })

  const onSubmit = ({ items }) => {
    try {
      saveMutation.mutate(serializeStatusValues(items))
    } catch (error) {
      setError('root', { message: error.message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col min-h-0' autoComplete='off'>
      <fieldset disabled={saveMutation.isLoading} className='min-h-[160px] p-5 overflow-auto disabled:opacity-70'>
        <div className='grid grid-cols-2 gap-3'>
          {fields.map((field, index) => (
            <div key={field.id} className='min-w-0'>
              <div className={`flex items-center max-w-full border rounded-full bg-gray-100 transition focus-within:border-primary ${errors.items?.[index]?.Title ? 'border-danger' : 'border-gray-300'}`}>
                <input
                  aria-label={`Trạng thái ${index + 1}`}
                  aria-invalid={Boolean(errors.items?.[index]?.Title)}
                  aria-describedby={errors.items?.[index]?.Title ? `status-error-${field.id}` : undefined}
                  className='flex-1 w-full min-w-0 py-2 pl-4 bg-transparent outline-none'
                  placeholder='Tên trạng thái'
                  {...register(`items.${index}.Title`, { required: 'Vui lòng nhập tên trạng thái.' })}
                />
                <button
                  type='button'
                  aria-label={`Xóa trạng thái ${index + 1}`}
                  onClick={() => remove(index)}
                  className='flex items-center justify-center shrink-0 w-11 h-11 text-gray-700 transition rounded-full hover:bg-gray-200 hover:text-danger'
                >
                  <XMarkIcon className='w-4 h-4' aria-hidden='true' />
                </button>
              </div>
              {errors.items?.[index]?.Title && (
                <div id={`status-error-${field.id}`} role='alert' className='mt-1 text-sm text-danger'>
                  {errors.items[index].Title.message}
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          type='button'
          onClick={() => append({ Title: '' })}
          className='flex items-center justify-center w-full gap-2 h-12 mt-4 transition border border-dashed rounded-lg border-gray-300 text-primary hover:border-primary hover:bg-gray-100'
        >
          <PlusIcon className='w-5 h-5' aria-hidden='true' />
          Thêm trạng thái
        </button>
        {errors.root && <div role='alert' className='mt-2 text-sm text-danger'>{errors.root.message}</div>}
      </fieldset>
      <div className='flex justify-end p-5 border-t border-light'>
        <button type='button' onClick={onClose} className='flex items-center h-12 px-5 transition border rounded border-light hover:border-gray-800'>
          Đóng
        </button>
        <Button
          type='submit'
          loading={saveMutation.isLoading}
          disabled={saveMutation.isLoading}
          className='flex items-center h-12 px-5 ml-2 text-white transition rounded bg-primary hover:bg-primaryhv disabled:opacity-70'
        >
          Lưu thay đổi
        </Button>
      </div>
    </form>
  )
}

export default StatusForm
