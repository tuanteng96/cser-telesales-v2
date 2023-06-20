import React, { useMemo } from 'react'
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid'
import ReactBaseTable from 'src/app/_ezs/partials/table'
import PickerMember from './components/PickerMember'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import useQueryParams from 'src/app/_ezs/hooks/useQueryParams'
import { useQuery } from 'react-query'
import TelesalesAPI from 'src/app/_ezs/api/telesales.api'
import moment from 'moment'
import PickerFilters from './components/PickerFilters'
import { useAuth } from 'src/app/_ezs/core/Auth'
import { pickBy } from 'lodash-es'
import StaffEdiTable from './components/StaffEdiTable'
import StocksEdiTable from './components/StocksEdiTable'
import StatusEdiTable from './components/StatusEdiTable'
import NoteEdiTable from './components/NoteEdiTable'

function TelesalesPage(props) {
  const { pathname } = useLocation()
  const queryParams = useQueryParams()
  const navigate = useNavigate()
  const { CrStocks } = useAuth()

  const queryConfig = {
    pi: queryParams.pi || 1,
    ps: queryParams.ps || 15,
    From: queryParams.From || '',
    To: queryParams.To || '',
    key: queryParams.key || '',
    CurrentUserID: queryParams.CurrentUserID || '',
    StockID: queryParams.StockID || CrStocks?.ID || '',
    Tags: queryParams.Tags || ''
  }

  const { data, isLoading, isPreviousData, refetch } = useQuery({
    queryKey: ['ListTelesales', queryConfig],
    queryFn: () => {
      const newQueryConfig = {
        filter: {
          From: queryConfig.From, //2023-06-01
          To: queryConfig.To, //2023-06-30
          Tags: queryConfig.Tags,
          CurrentUserID: queryConfig.CurrentUserID,
          StockID: queryConfig.StockID,
          key: queryConfig.key
        },
        pi: queryConfig.pi,
        ps: queryConfig.ps
      }
      return TelesalesAPI.list(newQueryConfig)
    },
    keepPreviousData: true
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
        width: 250,
        sortable: false
      },
      {
        key: 'HistorySupport',
        title: 'Lịch sử chăm sóc',
        dataKey: 'HistorySupport',
        width: 280,
        sortable: false
      },
      {
        key: 'ln',
        title: 'Lịch nhắc',
        dataKey: 'ln',
        width: 280,
        sortable: false
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
        key: '',
        title: '',
        dataKey: '',
        width: 115,
        sortable: false,
        frozen: 'right',
        cellRenderer: ({ rowData }) => (
          <div className='flex justify-center w-full'>
            <button className='bg-success hover:bg-successhv text-white mx-[2px] text-sm rounded cursor-pointer px-4 py-3 transition'>
              Đặt lịch
            </button>
          </div>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <div className='flex flex-col h-full p-4'>
      <div className='flex items-center justify-between mb-4'>
        <div className='text-2xl font-bold'>Danh sách khách hàng</div>
        <div className='flex'>
          <PickerFilters defaultValues={queryConfig}>
            {({ open }) => (
              <button
                onClick={open}
                type='button'
                className='border rounded transition hover:border-black bg-white border-[#d5d7da] h-12 flex items-center justify-center px-3'
              >
                Bộ lọc
                <AdjustmentsVerticalIcon className='w-6 ml-1.5' />
              </button>
            )}
          </PickerFilters>

          <PickerMember>
            {({ open }) => (
              <button
                onClick={open}
                type='button'
                className='flex items-center justify-center h-12 px-5 ml-2 text-white transition border rounded bg-primary border-primary hover:bg-primaryhv hover:border-primaryhv'
              >
                Thêm mới khách
              </button>
            )}
          </PickerMember>
        </div>
      </div>
      <ReactBaseTable
        pagination
        wrapClassName='grow'
        rowKey='ID'
        columns={columns}
        data={data?.data?.list || []}
        estimatedRowHeight={96}
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
  )
}

export default TelesalesPage
