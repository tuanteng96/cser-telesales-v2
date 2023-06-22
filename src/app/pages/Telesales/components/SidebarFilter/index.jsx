import { pickBy } from 'lodash-es'
import moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from 'src/app/_ezs/core/Auth'
import { useRoles } from 'src/app/_ezs/hooks/useRoles'
import { Button } from 'src/app/_ezs/partials/button'
import { Input } from 'src/app/_ezs/partials/forms'
import { InputDatePicker } from 'src/app/_ezs/partials/forms/input/InputDatePicker'
import { SelectStaffs, SelectStatusTelesale, SelectStocks } from 'src/app/_ezs/partials/select'

function SidebarFilter({ defaultValues }) {
  const { CrStocks } = useAuth()
  const { page_tele_basic, page_tele_adv } = useRoles(['page_tele_basic', 'page_tele_adv'])

  const { pathname } = useLocation()
  const navigate = useNavigate()

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      ...defaultValues,
      Status: defaultValues?.Status ? defaultValues?.Status.split(',') : '',
      From: defaultValues.From || '',
      To: defaultValues.To || '',
      BookFrom: defaultValues.BookFrom ? moment(defaultValues.BookFrom, 'YYYY-MM-DD') : '',
      BookTo: defaultValues.BookTo ? moment(defaultValues.BookTo, 'YYYY-MM-DD') : '',
      ReminderFrom: defaultValues.ReminderFrom ? moment(defaultValues.ReminderFrom, 'YYYY-MM-DD') : '',
      ReminderTo: defaultValues.ReminderTo ? moment(defaultValues.ReminderTo, 'YYYY-MM-DD') : ''
    }
  })

  const onSubmit = async (values) => {
    const newQueryConfig = {
      ...values,
      CurrentUserID: values?.CurrentUserID || '',
      From: values.From ? moment(values.From).format('YYYY-MM-DD') : '',
      To: values.To ? moment(values.To).format('YYYY-MM-DD') : '',
      BookFrom: values.BookFrom ? moment(values.BookFrom).format('YYYY-MM-DD') : '',
      BookTo: values.BookTo ? moment(values.BookTo).format('YYYY-MM-DD') : '',
      ReminderFrom: values.ReminderFrom ? moment(values.ReminderFrom).format('YYYY-MM-DD') : '',
      ReminderTo: values.ReminderTo ? moment(values.ReminderTo).format('YYYY-MM-DD') : '',
      StockID: values?.StockID || '',
      Status: values.Status ? values?.Status.join(',') : ''
    }
    navigate({
      pathname: pathname,
      search: createSearchParams(pickBy(newQueryConfig, (v) => v)).toString()
    })
  }

  const onResetFilters = () => {
    navigate({
      pathname: pathname,
      search: createSearchParams(
        pickBy(
          {
            pi: 1,
            ps: defaultValues?.ps,
            StockID: CrStocks?.ID || ''
          },
          (v) => v
        )
      ).toString()
    })
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='h-full bg-white w-[320px] hidden lg:flex flex-col'>
      <div className='relative flex justify-between px-5 py-5 border-b border-light'>
        <div className='text-2xl font-bold'>Bộ lọc</div>
      </div>
      <div className='p-5 overflow-auto grow'>
        <div className='mb-3.5 grid gap-4 grid-cols-2'>
          <div>
            <div className='font-light'>Từ ngày</div>
            <div className='mt-1'>
              <Controller
                name='From'
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputDatePicker
                    placeholderText='Chọn ngày'
                    autoComplete='off'
                    onChange={field.onChange}
                    selected={field.value ? new Date(field.value) : null}
                    {...field}
                    dateFormat='dd/MM/yyyy'
                  />
                )}
              />
            </div>
          </div>
          <div>
            <div className='font-light'>Đến ngày</div>
            <div className='mt-1'>
              <Controller
                name='To'
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputDatePicker
                    placeholderText='Chọn ngày'
                    autoComplete='off'
                    onChange={field.onChange}
                    selected={field.value ? new Date(field.value) : null}
                    {...field}
                    dateFormat='dd/MM/yyyy'
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className='mb-3.5'>
          <div className='font-light'>Thông tin khách hàng</div>
          <div className='mt-1'>
            <Controller
              name='key'
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <Input
                  placeholder='Nhập tên hoặc số điện thoại'
                  value={field.value}
                  onChange={field.onChange}
                  errorMessageForce={fieldState?.invalid}
                  errorMessage={fieldState?.error?.message}
                />
              )}
            />
          </div>
        </div>
        {page_tele_adv.hasRight && (
          <div className='mb-3.5'>
            <div className='font-light'>Nhân viên phụ trách</div>
            <div className='mt-1'>
              <Controller
                name='CurrentUserID'
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <SelectStaffs
                    isClearable
                    className='select-control'
                    value={field.value}
                    onChange={(val) => field.onChange(val?.value || '')}
                    StockRoles={page_tele_adv?.hasRight ? page_tele_adv?.StockRolesAll : page_tele_basic.StockRolesAll}
                  />
                )}
              />
            </div>
          </div>
        )}

        <div className='mb-3.5'>
          <div className='font-light'>Cơ sở</div>
          <div className='mt-1'>
            <Controller
              name='StockID'
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <SelectStocks
                  isClearable
                  className='select-control'
                  value={field.value}
                  onChange={(val) => field.onChange(val?.value || '')}
                  StockRoles={page_tele_adv?.hasRight ? page_tele_adv?.StockRoles : page_tele_basic.StockRoles}
                />
              )}
            />
          </div>
        </div>
        <div className='mb-3.5'>
          <div className='font-light'>Trạng thái</div>
          <div className='mt-1'>
            <Controller
              name='Status'
              control={control}
              render={({ field: { ref, ...field }, fieldState }) => (
                <SelectStatusTelesale
                  isMulti
                  className='select-control'
                  value={field.value}
                  onChange={(val) => field.onChange(val ? val.map((x) => x.value) : [])}
                />
              )}
            />
          </div>
        </div>
        <div className='mb-3.5 grid gap-4 grid-cols-2'>
          <div>
            <div className='font-light'>Đăt lịch từ</div>
            <div className='mt-1'>
              <Controller
                name='BookFrom'
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputDatePicker
                    placeholderText='Chọn ngày'
                    autoComplete='off'
                    onChange={field.onChange}
                    selected={field.value ? new Date(field.value) : null}
                    {...field}
                    dateFormat='dd/MM/yyyy'
                  />
                )}
              />
            </div>
          </div>
          <div>
            <div className='font-light'>Đăt lịch đến</div>
            <div className='mt-1'>
              <Controller
                name='BookTo'
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputDatePicker
                    placeholderText='Chọn ngày'
                    autoComplete='off'
                    onChange={field.onChange}
                    selected={field.value ? new Date(field.value) : null}
                    {...field}
                    dateFormat='dd/MM/yyyy'
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className='grid gap-4 grid-cols-2'>
          <div>
            <div className='font-light'>Lịch nhắc từ</div>
            <div className='mt-1'>
              <Controller
                name='ReminderFrom'
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputDatePicker
                    placeholderText='Chọn ngày'
                    autoComplete='off'
                    onChange={field.onChange}
                    selected={field.value ? new Date(field.value) : null}
                    {...field}
                    dateFormat='dd/MM/yyyy'
                  />
                )}
              />
            </div>
          </div>
          <div>
            <div className='font-light'>Lịch nhắc đến</div>
            <div className='mt-1'>
              <Controller
                name='ReminderTo'
                control={control}
                render={({ field: { ref, ...field }, fieldState }) => (
                  <InputDatePicker
                    placeholderText='Chọn ngày'
                    autoComplete='off'
                    onChange={field.onChange}
                    selected={field.value ? new Date(field.value) : null}
                    {...field}
                    dateFormat='dd/MM/yyyy'
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between p-5 border-t border-light'>
        <div
          className='cursor-pointer text-info hover:border-black bg-white border border-[#d5d7da] h-12 px-3 rounded flex items-center justify-center'
          onClick={onResetFilters}
        >
          Xóa bộ lọc
        </div>
        <Button
          type='submit'
          className='relative flex items-center justify-center h-12 px-5 ml-3 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70 flex-1'
        >
          Thực hiện
        </Button>
      </div>
    </form>
  )
}

export default SidebarFilter
