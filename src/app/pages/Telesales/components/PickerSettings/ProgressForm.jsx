import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useFieldArray, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import ConfigAPI from 'src/app/_ezs/api/config.api'
import { Button } from 'src/app/_ezs/partials/button'
import { Input } from 'src/app/_ezs/partials/forms'
import { parseProgressValue, prepareProgressValues } from './progressValues.js'

function ProgressGroup({ index, control, register, errors, onRemove }) {
  const { fields, append, remove } = useFieldArray({ control, name: `groups.${index}.Children` })
  const groupErrors = errors.groups?.[index]

  return (
    <div className='border rounded-lg border-gray-300'>
      <div className='p-4 border-b border-gray-300 rounded-t-lg bg-primary/5'>
        <label htmlFor={`progress-group-${index}`} className='block mb-2 text-xs font-semibold tracking-wide uppercase text-primary'>
          Nhóm tiến trình
        </label>
        <div className='flex items-start gap-2'>
          <div className='flex-1 min-w-0'>
            <Input
              id={`progress-group-${index}`}
              aria-label={`Tên nhóm ${index + 1}`}
              placeholder='Tên nhóm tiến trình'
              className='font-semibold'
              {...register(`groups.${index}.Title`, { validate: (value) => Boolean(value.trim()) || 'Vui lòng nhập tên nhóm.' })}
              errorMessageForce={Boolean(groupErrors?.Title)}
              errorMessage={groupErrors?.Title?.message}
            />
          </div>
          <button type='button' aria-label={`Xóa nhóm ${index + 1}`} onClick={onRemove} className='flex items-center justify-center w-11 h-12 shrink-0 text-gray-700 hover:text-danger'>
            <TrashIcon className='w-5 h-5' aria-hidden='true' />
          </button>
        </div>
      </div>
      <div className='p-4'>
        <div className='flex items-center justify-between gap-2 mb-3'>
          <div className='text-sm font-medium text-gray-700'>Tiến trình trong nhóm</div>
          <span className='px-2 py-1 text-xs rounded bg-gray-100 text-gray-700'>{fields.length} mục</span>
        </div>
        <div className='grid grid-cols-2 gap-3 p-3 ml-2 border rounded-lg border-gray-200 bg-gray-100'>
          {fields.map((field, childIndex) => {
            const error = groupErrors?.Children?.[childIndex]?.Title
            return (
              <div key={field.id} className='min-w-0'>
                <div className={`flex items-center border rounded bg-white transition focus-within:border-primary ${error ? 'border-danger' : 'border-gray-300'}`}>
                  <input
                    aria-label={`Tiến trình ${childIndex + 1} của nhóm ${index + 1}`}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `progress-error-${field.id}` : undefined}
                    placeholder='Tên tiến trình'
                    className='flex-1 w-full min-w-0 py-2 pl-3 bg-transparent'
                    {...register(`groups.${index}.Children.${childIndex}.Title`, {
                      validate: (value) => Boolean(value.trim()) || 'Vui lòng nhập tên tiến trình.'
                    })}
                  />
                  <button type='button' aria-label={`Xóa tiến trình ${childIndex + 1} của nhóm ${index + 1}`} onClick={() => remove(childIndex)} className='flex items-center justify-center w-11 h-11 shrink-0 rounded text-gray-700 hover:text-danger hover:bg-gray-100'>
                    <XMarkIcon className='w-4 h-4' aria-hidden='true' />
                  </button>
                </div>
                {error && <div id={`progress-error-${field.id}`} role='alert' className='mt-1 text-sm text-danger'>{error.message}</div>}
              </div>
            )
          })}
        </div>
        {fields.length === 0 && <div className='mt-2 ml-2 text-sm text-gray-700'>Chưa có tiến trình trong nhóm này.</div>}
        <button type='button' onClick={() => append({ Title: '' })} className='flex items-center gap-2 h-11 mt-2 text-primary'>
          <PlusIcon className='w-5 h-5' aria-hidden='true' />
          Thêm tiến trình
        </button>
      </div>
    </div>
  )
}

function ProgressForm({ value, onClose }) {
  const queryClient = useQueryClient()
  const { control, register, handleSubmit, setError, formState: { errors } } = useForm({
    defaultValues: { groups: parseProgressValue(value) }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'groups' })
  const saveMutation = useMutation({
    mutationFn: async (body) => {
      const result = await ConfigAPI.saveName({ name: 'ttpage', body })
      if (result.data?.error) throw new Error(result.data.error)
      return result
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['TelesalesSettings', 'ttpage'] }),
        queryClient.invalidateQueries({ queryKey: ['StatusTelesale'], refetchInactive: true })
      ])
      window.top?.toastr?.success('Lưu tiến trình Telesales thành công.', '', { timeOut: 1500 })
      onClose()
    },
    onError: () => setError('root', { message: 'Không thể lưu tiến trình. Vui lòng thử lại.' })
  })

  const onSubmit = ({ groups }) => {
    try {
      saveMutation.mutate(prepareProgressValues(groups))
    } catch (error) {
      setError('root', { message: error.message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col min-h-0' autoComplete='off'>
      <fieldset disabled={saveMutation.isLoading} className='min-h-0 p-5 overflow-auto disabled:opacity-70'>
        <div className='space-y-4'>
          {fields.map((field, index) => (
            <ProgressGroup key={`${field.id}-${index}`} {...{ index, control, register, errors }} onRemove={() => remove(index)} />
          ))}
        </div>
        <button type='button' onClick={() => append({ Title: '', Children: [] })} className='flex items-center justify-center w-full gap-2 h-12 mt-4 border border-dashed rounded-lg border-gray-300 text-primary hover:border-primary hover:bg-gray-100'>
          <PlusIcon className='w-5 h-5' aria-hidden='true' />
          Thêm nhóm tiến trình
        </button>
        {errors.root && <div role='alert' className='mt-2 text-sm text-danger'>{errors.root.message}</div>}
      </fieldset>
      <div className='flex justify-end p-5 border-t border-light'>
        <button type='button' onClick={onClose} className='flex items-center h-12 px-5 transition border rounded border-light hover:border-gray-800'>Đóng</button>
        <Button type='submit' loading={saveMutation.isLoading} disabled={saveMutation.isLoading} className='flex items-center h-12 px-5 ml-2 text-white transition rounded bg-primary hover:bg-primaryhv disabled:opacity-70'>
          Lưu thay đổi
        </Button>
      </div>
    </form>
  )
}

export default ProgressForm
