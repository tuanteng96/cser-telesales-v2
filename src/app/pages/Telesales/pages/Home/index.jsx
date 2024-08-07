import { useMemo, useState } from 'react'
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid'
import ReactBaseTable from 'src/app/_ezs/partials/table'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import useQueryParams from 'src/app/_ezs/hooks/useQueryParams'
import { useQuery } from 'react-query'
import TelesalesAPI from 'src/app/_ezs/api/telesales.api'
import moment from 'moment'
import PickerFilters from '../../components/PickerFilters'
import { useAuth } from 'src/app/_ezs/core/Auth'
import { pickBy } from 'lodash-es'
import StaffEdiTable from '../../components/StaffEdiTable'
import StocksEdiTable from '../../components/StocksEdiTable'
import StatusEdiTable from '../../components/StatusEdiTable'
import NoteEdiTable from '../../components/NoteEdiTable'
import PickerBooking from '../../components/PickerBooking'
import Text from 'react-texty'
import PickerCareHistory from '../../components/PickerCareHistory'
import PickerReminder from '../../components/PickerReminder'
import SidebarFilter from '../../components/SidebarFilter'
import { useRoles } from 'src/app/_ezs/hooks/useRoles'
import PickerMember from '../../components/PickerMember'
import ConfigAPI from 'src/app/_ezs/api/config.api'

function Home() {
  const { pathname } = useLocation()
  const queryParams = useQueryParams()
  const navigate = useNavigate()
  const { auth } = useAuth()

  const { page_tele_adv } = useRoles(['page_tele_adv'])

  const queryConfig = {
    pi: queryParams.pi || 1,
    ps: queryParams.ps || 15,
    From: queryParams.From || '',
    To: queryParams.To || '',
    key: queryParams.key || '',
    CurrentUserID: page_tele_adv.hasRight ? queryParams.CurrentUserID || '' : auth.ID,
    StockID: queryParams.StockID || '',
    Status: queryParams.Status || '',
    BookFrom: queryParams.BookFrom || '',
    BookTo: queryParams.BookTo || '',
    ReminderFrom: queryParams.ReminderFrom || '',
    ReminderTo: queryParams.ReminderTo || ''
  }

  const { data, isLoading, isPreviousData } = useQuery({
    queryKey: ['ListTelesales', queryConfig],
    queryFn: () => {
      const newQueryConfig = {
        filter: {
          ...queryConfig,
          From: queryConfig.From, //2023-06-01
          To: queryConfig.To, //2023-06-30
          Status: queryConfig.Status,
          CurrentUserID: queryConfig.CurrentUserID,
          StockID: queryConfig.StockID,
          Key: queryConfig.key
        },
        pi: queryConfig.pi,
        ps: queryConfig.ps
      }
      return TelesalesAPI.list(newQueryConfig)
    },
    keepPreviousData: true
  })

  const SettingCalendar = useQuery({
    queryKey: ['SettingCalendar'],
    queryFn: async () => {
      
      let { data } = await ConfigAPI.getName(`ArticleRel`)
      let rs = {
        Tags: '',
        OriginalServices: []
      }
      if (data?.data && data?.data?.length > 0) {
        const result = JSON.parse(data?.data[0].Value)
        if (result) {
          rs = result
        }
      }
      return rs
    },
    initialData: {
      Tags: '',
      OriginalServices: []
    }
  })

  const columns = useMemo(
    () => [
      {
        key: 'CreateDate',
        title: 'Ngày tạo',
        dataKey: 'CreateDate',
        cellRenderer: ({ rowData }) => moment(rowData?.CreateDate).format('DD-MM-YYYY'),
        width: 135,
        sortable: false
      },
      {
        key: 'Member',
        title: 'Khách hàng',
        dataKey: 'Member',
        cellRenderer: ({ rowData }) => (
          <PickerMember rowData={rowData}>
            {({ open }) => (
              <div className='w-full px-[15px] py-[12px] cursor-pointer' onClick={open}>
                <div className='font-medium'>{rowData.FullName}</div>
                <div className='font-light'>{rowData.Phone}</div>
              </div>
            )}
          </PickerMember>
        ),
        width: 250,
        sortable: false,
        headerClassName: '!px-[15px]',
        style: {
          padding: 0
        }
      },
      {
        key: 'Note',
        title: 'Ghi chú',
        dataKey: 'Note',
        cellRenderer: ({ rowData }) => <NoteEdiTable initialValues={rowData} />,
        width: 280,
        sortable: false
      },
      {
        key: 'Status',
        title: 'Trạng thái',
        dataKey: 'Status',
        cellRenderer: ({ rowData }) => <StatusEdiTable initialValues={rowData} />,
        width: 350,
        sortable: false
      },
      {
        key: 'His',
        title: 'Lịch sử chăm sóc',
        dataKey: 'His',
        cellRenderer: ({ rowData }) => (
          <PickerCareHistory rowData={rowData}>
            {({ open }) => (
              <div className='w-full px-[15px] py-[12px] cursor-pointer' onClick={open}>
                {rowData?.His?.List && rowData?.His?.List.length > 0 ? (
                  <>
                    <div className='mb-1'>{moment(rowData?.His?.List[0].CreateDate).format('HH:mm DD-MM-YYYY')}</div>
                    <Text tooltipMaxWidth={280} className='w-full truncate'>
                      {rowData?.His?.List[0].Content}
                    </Text>
                  </>
                ) : (
                  <div className='text-muted'>Thêm mới lịch sử</div>
                )}
              </div>
            )}
          </PickerCareHistory>
        ),
        width: 280,
        sortable: false,
        style: {
          padding: 0
        },
        headerClassName: '!px-[15px]'
      },
      {
        key: 'Noti',
        title: 'Lịch nhắc',
        dataKey: 'Noti',
        cellRenderer: ({ rowData }) => (
          <PickerReminder rowData={rowData}>
            {({ open }) => (
              <div className='w-full px-[15px] py-[12px] cursor-pointer' onClick={open}>
                {rowData?.Noti?.List && rowData?.Noti?.List.length > 0 ? (
                  <>
                    <div className='mb-1'>
                      {moment(rowData?.Noti?.List[0].ReminderDate, 'YYYY-MM-DD HH:mm').format('HH:mm DD-MM-YYYY')}
                      {rowData?.Noti?.List[0].isReminded && <span className='pl-1 text-success'>- Đã nhắc</span>}
                    </div>
                    <Text tooltipMaxWidth={280} className='w-full truncate'>
                      {rowData?.Noti?.List[0].Content}
                    </Text>
                  </>
                ) : (
                  <div className='text-muted'>Thêm mới lịch nhắc</div>
                )}
              </div>
            )}
          </PickerReminder>
        ),
        width: 280,
        sortable: false,
        style: {
          padding: 0
        },
        headerClassName: '!px-[15px]'
      },
      {
        key: 'User.FullName',
        title: 'Người tạo',
        dataKey: 'User.FullName',
        width: 250,
        sortable: false
      },
      {
        key: 'CurrentStock.Title',
        title: 'Cơ sở chuyển đến',
        dataKey: 'CurrentStock.Title',
        cellRenderer: ({ rowData }) => <StocksEdiTable initialValues={rowData} />,
        width: 250,
        sortable: false
      },
      {
        key: 'CurrentStockID',
        title: 'Nhân viên phụ trách',
        dataKey: 'CurrentStockID',
        cellRenderer: ({ rowData }) => <StaffEdiTable initialValues={rowData} />,
        width: 270,
        sortable: false
      },
      {
        key: 'Book',
        title: 'Lịch đặt gần nhất',
        dataKey: 'Book',
        cellRenderer: ({ rowData }) => (
          <PickerBooking
            rowData={rowData}
            isAddMode={!(rowData?.Book?.ID > 0)}
            TagsList={
              SettingCalendar?.data?.Tags
                ? SettingCalendar?.data?.Tags.split(',').map((x) => ({
                    label: x,
                    value: x
                  }))
                : []
            }
          >
            {({ open }) => (
              <div className='w-full px-[15px] py-[12px] cursor-pointer' onClick={open}>
                {rowData?.Book?.ID ? (
                  <>
                    <div>{moment(rowData?.Book?.BookDate).format('HH:mm DD-MM-YYYY')}</div>
                    <Text tooltipMaxWidth={280} className='w-full truncate'>
                      {rowData?.Book?.RootTitles || 'Chưa xác định'} - {rowData?.Book?.Stock?.Title || 'Chưa xác định'}
                    </Text>
                  </>
                ) : (
                  <span className='text-muted'>Đặt lịch mới</span>
                )}
              </div>
            )}
          </PickerBooking>
        ),
        width: 270,
        sortable: false,
        style: {
          padding: 0
        },
        headerClassName: '!px-[15px]'
      },
      {
        key: '',
        title: '',
        dataKey: '',
        width: 115,
        sortable: false,
        frozen: 'right',
        cellRenderer: ({ rowData }) => (
          <div className='flex justify-center w-full'>
            <PickerBooking
              rowData={rowData}
              isAddMode
              TagsList={
                SettingCalendar?.data?.Tags
                  ? SettingCalendar?.data?.Tags.split(',').map((x) => ({
                      label: x,
                      value: x
                    }))
                  : []
              }
            >
              {({ open }) => (
                <button
                  className='bg-success hover:bg-successhv text-white mx-[2px] text-sm rounded cursor-pointer px-4 py-3 transition'
                  onClick={open}
                >
                  Đặt lịch
                </button>
              )}
            </PickerBooking>
          </div>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [SettingCalendar]
  )

  return (
    <div className='flex h-full'>
      <SidebarFilter defaultValues={queryConfig} />
      <div className='flex flex-col flex-1 h-full p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='text-xl font-bold md:text-2xl'>Danh sách khách hàng</div>
          <div className='flex'>
            <PickerFilters defaultValues={queryConfig}>
              {({ open }) => (
                <button
                  onClick={open}
                  type='button'
                  className='border rounded transition hover:border-black bg-white border-[#d5d7da] h-12 flex items-center justify-center px-3 lg:hidden'
                >
                  <span className='hidden md:inline-block pr-1.5'>Bộ lọc</span>
                  <AdjustmentsVerticalIcon className='w-6' />
                </button>
              )}
            </PickerFilters>

            <PickerMember>
              {({ open }) => (
                <button
                  onClick={open}
                  type='button'
                  className='flex items-center justify-center h-12 px-2 md:px-5 ml-2 text-white transition border rounded bg-primary border-primary hover:bg-primaryhv hover:border-primaryhv text-[14px] md:text-base'
                >
                  Thêm mới
                </button>
              )}
            </PickerMember>
          </div>
        </div>
        <ReactBaseTable
          fixed
          pagination
          wrapClassName='grow'
          rowKey='ID'
          columns={columns}
          data={data?.data?.list || []}
          rowHeight={110}
          isPreviousData={isPreviousData}
          loading={isLoading || isPreviousData}
          pageCount={data?.data?.pcount}
          pageOffset={Number(queryConfig.pi)}
          pageSizes={Number(queryConfig.ps)}
          onChange={({ pageIndex, pageSize }) =>
            navigate({
              pathname: pathname,
              search: createSearchParams(
                pickBy(
                  {
                    ...queryConfig,
                    pi: pageIndex,
                    ps: pageSize
                  },
                  (v) => v
                )
              ).toString()
            })
          }
        />
      </div>
    </div>
  )
}

export default Home
