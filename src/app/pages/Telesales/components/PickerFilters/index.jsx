import { FloatingPortal } from '@floating-ui/react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import { pickBy } from 'lodash-es'
import moment from 'moment'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from 'src/app/_ezs/core/Auth'
import { useRoles } from 'src/app/_ezs/hooks/useRoles'
import { Button } from 'src/app/_ezs/partials/button'
import { Input } from 'src/app/_ezs/partials/forms'
import { InputDatePicker } from 'src/app/_ezs/partials/forms/input/InputDatePicker'
import { SelectStaffs, SelectStatusTelesale, SelectStocks } from 'src/app/_ezs/partials/select'

function PickerFilters({ children, defaultValues }) {
  const { CrStocks } = useAuth()
  const { page_tele_basic, page_tele_adv } = useRoles(['page_tele_basic', 'page_tele_adv'])

  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [visible, setVisible] = useState(false)

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

  const onHide = () => {
    setVisible(false)
  }

  const onSubmit = async (values) => {
    const newQueryConfig = {
      ...values,
      CurrentUserID: values?.CurrentUserID?.value || '',
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
    onHide()
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
    onHide()
  }

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false)
      })}
      <AnimatePresence>
        {visible && (
          <FloatingPortal>
            <LayoutGroup>
              <Dialog open={visible} onClose={onHide}>
                <m.div
                  className='fixed inset-0 bg-black/[.2] z-[1003]'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></m.div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='fixed inset-0 flex items-center justify-center z-[1003]'
                  autoComplete='off'
                >
                  <m.div
                    className='absolute flex flex-col justify-center h-full py-8'
                    initial={{ opacity: 0, top: '60%' }}
                    animate={{ opacity: 1, top: 'auto' }}
                    exit={{ opacity: 0, top: '60%' }}
                  >
                    <Dialog.Panel
                      tabIndex={0}
                      className='bg-white max-w-full w-[500px] max-h-full flex flex-col rounded shadow-lg'
                    >
                      <Dialog.Title className='relative flex justify-between px-5 py-5 border-b border-light'>
                        <div className='text-2xl font-bold'>Bộ lọc khách hàng</div>
                        <div
                          className='absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4'
                          onClick={onHide}
                        >
                          <XMarkIcon className='w-8' />
                        </div>
                      </Dialog.Title>
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
                                    StockRoles={
                                      page_tele_adv?.hasRight ? page_tele_adv?.StockRoles : page_tele_basic.StockRoles
                                    }
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
                                  StockRoles={
                                    page_tele_adv?.hasRight ? page_tele_adv?.StockRoles : page_tele_basic.StockRoles
                                  }
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
                            <div className='font-light'>Đăt lịch từ ngày</div>
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
                            <div className='font-light'>Đăt lịch đến ngày</div>
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
                            <div className='font-light'>Lịch nhắc từ ngày</div>
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
                            <div className='font-light'>Lịch nhắc đến ngày</div>
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
                        <div className='cursor-pointer text-info' onClick={onResetFilters}>
                          Xóa bộ lọc
                        </div>
                        <div className='flex justify-end'>
                          <button
                            type='button'
                            className='relative flex items-center h-12 px-5 transition border rounded shadow-lg border-light hover:border-gray-800 focus:outline-none focus:shadow-none'
                            onClick={onHide}
                          >
                            Hủy
                          </button>
                          <Button
                            type='submit'
                            className='relative flex items-center h-12 px-5 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70'
                          >
                            Thực hiện
                          </Button>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </m.div>
                </form>
              </Dialog>
            </LayoutGroup>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  )
}

export default PickerFilters
