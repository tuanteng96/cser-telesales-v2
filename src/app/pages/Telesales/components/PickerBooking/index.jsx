import { FloatingPortal } from '@floating-ui/react'
import { Dialog, Switch } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import moment from 'moment'
import { useEffect } from 'react'
import { Fragment, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import CalendarAPI from 'src/app/_ezs/api/calendar.api'
import TelesalesAPI from 'src/app/_ezs/api/telesales.api'
import { useAuth } from 'src/app/_ezs/core/Auth'
import { useRoles } from 'src/app/_ezs/hooks/useRoles'
import { Button } from 'src/app/_ezs/partials/button'
import { InputTextarea } from 'src/app/_ezs/partials/forms'
import { InputDatePicker } from 'src/app/_ezs/partials/forms/input/InputDatePicker'
import { SelectService, SelectStaffsService, SelectStocks } from 'src/app/_ezs/partials/select'

function PickerBooking({ children, rowData, isAddMode }) {
  const { CrStocks } = useAuth()
  const [visible, setVisible] = useState(false)
  const queryClient = useQueryClient()

  const { page_tele_basic, page_tele_adv } = useRoles(['page_tele_basic', 'page_tele_adv'])

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      MemberID: rowData?.MemberID,
      RootIdS: '',
      BookDate: new Date(),
      Desc: '',
      StockID: CrStocks?.ID,
      UserServiceIDs: '',
      AtHome: false
    }
  })

  const watchStockID = watch('StockID', false)

  useEffect(() => {
    if (!isAddMode) {
      reset({
        MemberID: rowData?.MemberID,
        ID: rowData?.Book?.ID,
        RootIdS: rowData?.Book?.Roots ? rowData?.Book?.Roots?.map((x) => x.ID) : '',
        Status: rowData?.Book?.Status,
        BookDate: rowData?.Book?.BookDate ? new Date(rowData?.Book?.BookDate) : '',
        StockID: rowData?.Book?.StockID,
        Desc: rowData?.Book?.Desc,
        UserServiceIDs: rowData?.Book?.UserServices ? rowData?.Book?.UserServices.map((x) => x.ID) : '',
        AtHome: rowData?.Book?.AtHome
      })
    } else {
      reset({
        MemberID: rowData?.MemberID,
        RootIdS: rowData?.ServiceIds ? rowData?.ServiceIds.split(',').map(x => Number(x)) : '',
        BookDate: new Date(),
        Desc: '',
        StockID: CrStocks?.ID,
        UserServiceIDs: '',
        AtHome: false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const addBookingMutation = useMutation({
    mutationFn: async (data) => {
      try {
        const result = await CalendarAPI.booking(data)
        const item = result?.data?.data?.items ? result?.data?.data?.items[0] : null
        if (item) {
          let dataUpdate = {
            edit: [
              {
                ...rowData,
                Book: item,
                Status: window?.top?.GlobalConfig?.Admin?.kpiSuccess || rowData.Status
              }
            ]
          }
          await TelesalesAPI.addMember(dataUpdate)
        }
        return item
      } catch (error) {
        console.log(error)
      }
    }
  })

  const onHide = () => setVisible(false)

  const onSubmit = async (values) => {
    const dataPost = {
      booking: [
        {
          ...values,
          MemberID: values.MemberID,
          RootIdS: values.RootIdS ? values.RootIdS.toString() : '',
          UserServiceIDs: values.UserServiceIDs ? values.UserServiceIDs.toString() : '',
          BookDate: moment(values.BookDate).format('YYYY-MM-DD HH:mm'),
          Status: 'XAC_NHAN',
          IsAnonymous: false,
          CreateBy: values.MemberID
        }
      ]
    }
    addBookingMutation.mutate(dataPost, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ListTelesales'] }).then(() => {
          onHide()
          reset()
          window.top?.toastr &&
            window.top?.toastr.success('Đặt lịch thành công.', '', {
              timeOut: 1500
            })
        })
      },
      onError: (err) => console.log(err)
    })
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
                        <div className='text-2xl font-bold'>
                          {isAddMode ? 'Đặt lịch dịch vụ' : 'Chỉnh sửa đặt lịch'}
                        </div>
                        <div
                          className='absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4'
                          onClick={onHide}
                        >
                          <XMarkIcon className='w-8' />
                        </div>
                      </Dialog.Title>
                      <div className='overflow-auto grow'>
                        <div className='p-5'>
                          <div className='font-light'>Khách hàng</div>
                          <div className='font-semibold mt-2.5'>
                            {rowData?.FullName} - {rowData?.Phone}
                          </div>
                        </div>
                        <div className='p-5 border-t'>
                          <div className='mb-2'>
                            <div className='font-light'>Thời gian / Cơ sở</div>
                            <div className='mt-1'>
                              <Controller
                                name='BookDate'
                                control={control}
                                render={({ field: { ref, ...field }, fieldState }) => (
                                  <InputDatePicker
                                    placeholderText='Chọn thời gian'
                                    autoComplete='off'
                                    onChange={field.onChange}
                                    selected={field.value ? new Date(field.value) : null}
                                    {...field}
                                    dateFormat='HH:mm dd/MM/yyyy'
                                    showTimeSelect
                                    timeFormat='HH:mm'
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div>
                            <div className='mt-1'>
                              <Controller
                                name='StockID'
                                control={control}
                                render={({ field: { ref, ...field }, fieldState }) => (
                                  <SelectStocks
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
                        </div>
                        <div className='p-5 border-t'>
                          <div className='mb-4'>
                            <div className='font-light'>Dịch vụ</div>
                            <div className='mt-1'>
                              <Controller
                                name='RootIdS'
                                control={control}
                                render={({ field: { ref, ...field }, fieldState }) => (
                                  <SelectService
                                    isMulti
                                    isClearable
                                    className='select-control'
                                    value={field.value}
                                    onChange={(val) => field.onChange(val ? val.map((x) => x.value) : [])}
                                    MemberID={rowData?.MemberID}
                                    StockID={watchStockID}
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div className='flex items-center justify-between'>
                            <div className='font-light'>Sử dụng dịch vụ tại nhà</div>
                            <Controller
                              name='AtHome'
                              control={control}
                              render={({ field }) => (
                                <Switch checked={field.value} onChange={(val) => field.onChange(val)} as={Fragment}>
                                  {({ checked }) => (
                                    /* Use the `checked` state to conditionally style the button. */
                                    <button
                                      className={clsx(
                                        'relative inline-flex h-7 w-11 items-center rounded-full transition',
                                        checked ? 'bg-primary' : 'bg-[#ebedf3]'
                                      )}
                                    >
                                      <span className='sr-only'>Enable notifications</span>
                                      <span
                                        className={clsx(
                                          'inline-block h-5 w-5 transform rounded-full bg-white transition',
                                          checked ? 'translate-x-5' : 'translate-x-1'
                                        )}
                                      />
                                    </button>
                                  )}
                                </Switch>
                              )}
                            />
                          </div>
                        </div>
                        <div className='p-5 border-t'>
                          <div className='mb-2'>
                            <div className='font-light'>Nhân viên thực hiện</div>
                            <div className='mt-1'>
                              <Controller
                                name='UserServiceIDs'
                                control={control}
                                render={({ field: { ref, ...field }, fieldState }) => (
                                  <SelectStaffsService
                                    isMulti
                                    isClearable
                                    className='select-control'
                                    value={field.value}
                                    onChange={(val) => field.onChange(val ? val.map((x) => x.value) : [])}
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div>
                            <Controller
                              name='Desc'
                              control={control}
                              render={({ field: { ref, ...field }, fieldState }) => (
                                <InputTextarea rows={3} placeholder='Nhập ghi chú' {...field} />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='flex justify-end p-5 border-t border-light'>
                        <button
                          type='button'
                          className='relative flex items-center h-12 px-5 transition border rounded shadow-lg border-light hover:border-gray-800 focus:outline-none focus:shadow-none'
                          onClick={onHide}
                        >
                          Hủy
                        </button>
                        <Button
                          disabled={addBookingMutation.isLoading}
                          loading={addBookingMutation.isLoading}
                          type='submit'
                          className='relative flex items-center h-12 px-5 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70'
                        >
                          {isAddMode ? 'Thực hiện' : 'Lưu thay đổi'}
                        </Button>
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

export default PickerBooking
