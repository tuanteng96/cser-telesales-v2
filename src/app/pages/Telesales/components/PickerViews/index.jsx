import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { FloatingPortal } from '@floating-ui/react'
import { Dialog, Tab } from '@headlessui/react'
import { ArrowLeftIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import { useInfiniteQuery, useQuery } from 'react-query'
import TelesalesAPI from 'src/app/_ezs/api/telesales.api'
import moment from 'moment'
import { formatString } from 'src/app/_ezs/utils/formatString'
import ReactBaseTable from 'src/app/_ezs/partials/table'
import { uniqueId } from 'lodash-es'
import { formatArray } from 'src/app/_ezs/utils/formatArray'
import Text from 'react-texty'
import clsx from 'clsx'
import PickerMember from '../PickerMember'

function PickerViews({ children, rowData }) {
  const [visible, setVisible] = useState(false)

  const onHide = () => {
    setVisible(false)
  }

  let CustomerDetails = useQuery({
    queryKey: ['customer-details', rowData.MemberID],
    queryFn: async () => {
      let { data } = await TelesalesAPI.getMemberID(rowData.MemberID)
      return data
    },
    enabled: visible && rowData.MemberID > 0
  })

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
                  className='fixed inset-0 bg-[#f5f7fb] z-[1003]'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className='flex h-full gap-5 p-4'>
                    <div className='w-[300px]'>
                      <div className='flex flex-col h-full bg-white rounded shadow'>
                        <div
                          className='flex gap-3 p-4 font-semibold uppercase border-b cursor-pointer'
                          onClick={onHide}
                        >
                          <ArrowLeftIcon className='w-6 h-6' />
                          Thông tin khách hàng
                        </div>
                        <div className='overflow-auto grow'>
                          <div>
                            <div className='flex items-center gap-4 p-4'>
                              <div className='relative w-12 h-12 overflow-hidden bg-gray-400 rounded-full'>
                                <svg
                                  fill='currentColor'
                                  viewBox='0 0 20 20'
                                  xmlns='http://www.w3.org/2000/svg'
                                  className='absolute text-white w-14 h-14 -left-1'
                                >
                                  <path
                                    fillRule='evenodd'
                                    d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                              </div>
                              <div>
                                <div className='font-semibold'>{CustomerDetails.data?.member?.FullName}</div>
                                <div className='font-number text-[15px] font-medium leading-4 mt-1'>
                                  {CustomerDetails.data?.member?.MobilePhone}
                                </div>
                              </div>
                            </div>
                            <div className='px-4'>
                              <div className='flex justify-between mb-1 last:mb-0'>
                                <div className='text-gray-500'>Cơ sở</div>
                                <div className='font-medium'>{CustomerDetails.data?.member?.ByStock?.Title}</div>
                              </div>
                              <div className='flex justify-between mb-1 last:mb-0'>
                                <div className='text-gray-500'>Nhóm</div>
                                <div className='font-medium'>
                                  {CustomerDetails.data?.member?.GroupNames || 'Chưa có nhóm'}
                                </div>
                              </div>
                              <div className='flex justify-between mb-1 last:mb-0'>
                                <div className='text-gray-500'>Ngày sinh nhật</div>
                                <div className='font-medium'>
                                  {CustomerDetails.data?.member?.BirthDate
                                    ? moment(CustomerDetails.data?.member?.BirthDate).format('DD/MM/YYYY')
                                    : 'Chưa cập nhật'}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='grid grid-cols-2 gap-3 p-4 mt-4 border-t'>
                            <div className='bg-[#efefef] rounded text-center py-3.5'>
                              <div className='text-[13px]'>Ví điện tử</div>
                              <div className='font-number text-[15px] font-semibold'>
                                {formatString.formatVND(CustomerDetails.data?.member?.Present?.nap_vi)}
                              </div>
                            </div>
                            <div className='bg-[#efefef] rounded text-center py-3.5'>
                              <div className='text-[13px]'>Thẻ tiền</div>
                              <div className='font-number text-[15px] font-semibold'>
                                {formatString.formatVND(CustomerDetails.data?.member?.Present?.the_tien_kha_dung)}
                              </div>
                            </div>
                            <div className='bg-[#efefef] rounded text-center py-3.5'>
                              <div className='text-[13px]'>Đã chi tiêu</div>
                              <div className='font-number text-[15px] font-semibold'>
                                {formatString.formatVND(CustomerDetails.data?.member?.Present?.da_chi_tieu)}
                              </div>
                            </div>
                            <div className='bg-[#efefef] rounded text-center py-3.5'>
                              <div className='text-[13px]'>Công nợ</div>
                              <div className='font-number text-[15px] font-semibold text-danger'>
                                {formatString.formatVND(CustomerDetails.data?.member?.Present?.no)}
                              </div>
                            </div>
                            <div className='bg-[#efefef] rounded text-center py-3.5 col-span-2'>
                              <div className='text-[13px]'>Tích điểm</div>
                              <div className='font-number text-[15px] font-semibold'>
                                {formatString.formatVND(CustomerDetails.data?.member?.Present?.points)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='p-4'>
                          <PickerMember rowData={rowData}>
                            {({ open }) => (
                              <button
                                onClick={open}
                                className='flex justify-center w-full gap-2 py-3 font-medium text-white rounded cursor-pointer bg-primary'
                                type='button'
                              >
                                Chỉnh sửa thông tin
                                <PencilIcon className='w-5' />
                              </button>
                            )}
                          </PickerMember>
                        </div>
                      </div>
                    </div>
                    <div className='flex-1 h-full'>
                      <Tab.Group as='div' className='flex flex-col h-full'>
                        <Tab.List className='flex p-1.5 mb-4 space-x-1.5 bg-[#eceef2] rounded'>
                          <Tab as={Fragment}>
                            {({ selected }) => (
                              <button
                                className={clsx(
                                  'w-full rounded py-3 font-number text-[13px] font-semibold leading-5 uppercase cursor-pointer transition-all',
                                  selected
                                    ? 'bg-primary text-white shadow'
                                    : 'bg-[#eceef2] text-[#5b7182] hover:bg-white hover:shadow'
                                )}
                              >
                                Thẻ liệu trình
                              </button>
                            )}
                          </Tab>
                          <Tab as={Fragment}>
                            {({ selected }) => (
                              <button
                                className={clsx(
                                  'w-full rounded py-3 font-number text-[13px] font-semibold leading-5 uppercase cursor-pointer transition-all',
                                  selected
                                    ? 'bg-primary text-white shadow'
                                    : 'bg-[#eceef2] text-[#5b7182] hover:bg-white hover:shadow'
                                )}
                              >
                                Sản phẩm sắp hết
                              </button>
                            )}
                          </Tab>
                          <Tab as={Fragment}>
                            {({ selected }) => (
                              <button
                                className={clsx(
                                  'w-full rounded py-3 font-number text-[13px] font-semibold leading-5 uppercase cursor-pointer transition-all',
                                  selected
                                    ? 'bg-primary text-white shadow'
                                    : 'bg-[#eceef2] text-[#5b7182] hover:bg-white hover:shadow'
                                )}
                              >
                                Lịch sử mua hàng
                              </button>
                            )}
                          </Tab>
                          <Tab as={Fragment}>
                            {({ selected }) => (
                              <button
                                className={clsx(
                                  'w-full rounded py-3 font-number text-[13px] font-semibold leading-5 uppercase cursor-pointer transition-all',
                                  selected
                                    ? 'bg-primary text-white shadow'
                                    : 'bg-[#eceef2] text-[#5b7182] hover:bg-white hover:shadow'
                                )}
                              >
                                Lịch sử sử dụng dịch vụ
                              </button>
                            )}
                          </Tab>
                        </Tab.List>
                        <Tab.Panels className='grow'>
                          <Tab.Panel className='h-full'>
                            {({ selected }) => (
                              <TreatmentProgressTab
                                Prods={CustomerDetails?.data?.prods || []}
                                isLoading={CustomerDetails?.isLoading}
                              />
                            )}
                          </Tab.Panel>
                          <Tab.Panel className='h-full'>
                            {({ selected }) => <LowStockProductTab MemberID={rowData.MemberID} isActive={selected} />}
                          </Tab.Panel>
                          <Tab.Panel className='h-full'>
                            {({ selected }) => <PurchaseHistoryTab MemberID={rowData.MemberID} isActive={selected} />}
                          </Tab.Panel>
                          <Tab.Panel className='h-full'>
                            {({ selected }) => (
                              <ServiceUsageHistoryTab MemberID={rowData.MemberID} isActive={selected} />
                            )}
                          </Tab.Panel>
                        </Tab.Panels>
                      </Tab.Group>
                    </div>
                  </div>
                </m.div>
              </Dialog>
            </LayoutGroup>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  )
}

const TreatmentProgressTab = ({ Prods = [], isLoading }) => {
  let [Lists, setLists] = useState([])

  const getIndexProds = (item) => {
    if (item.BH > 0) {
      if (moment().diff(moment(item.EndDate, 'YYYY-MM-DD HH:mm'), 'minutes') > 0 || item.BH_Total === item.BH_Done) {
        return 1
      } else {
        return 0
      }
    } else {
      if (moment().diff(moment(item.EndDate, 'YYYY-MM-DD HH:mm'), 'minutes') > 0 || item.Done === item.Total) {
        return 1
      } else {
        return 0
      }
    }
  }

  useEffect(() => {
    setLists(
      Prods.map((item) => ({
        ...item,
        Ids: uniqueId(),
        Index: getIndexProds(item)
      })).sort((a, b) => a.Index - b.Index)
    )
  }, [Prods])

  const columns = useMemo(
    () => [
      {
        key: 'index',
        title: 'STT',
        dataKey: 'index',
        cellRenderer: ({ rowIndex }) => rowIndex + 1,
        width: 60,
        sortable: false,
        align: 'center'
      },
      {
        key: 'ProdTitle',
        title: 'Tên dịch vụ',
        dataKey: 'ProdTitle',
        width: 300,
        sortable: false
      },
      {
        key: 'Total',
        title: 'Tiến trình',
        dataKey: 'Total',
        cellRenderer: ({ rowData }) => (
          <div className='flex items-center w-full gap-2'>
            <div className='flex-1 h-[13px] bg-gray-200 rounded overflow-hidden'>
              <div
                role='progressbar'
                className='flex items-center justify-center h-full transition-all bg-primary'
                style={{
                  width: `${(rowData.Done / rowData.Total) * 100 || 0}%`
                }}
                aria-valuenow={(rowData.Done / rowData.Total) * 100 || 0}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {rowData.Done > 0 && (
                  <span className='text-[10px] font-semibold text-white font-number'>{rowData.Done}b</span>
                )}
              </div>
            </div>

            <div className='w-[50px] text-right font-semibold text-sm font-number'>
              {rowData.Done} / {rowData.Total}
            </div>
          </div>
        ),
        width: 250,
        sortable: false
      },
      {
        key: 'BH_Title',
        title: 'Bảo hành',
        dataKey: 'BH_Title',
        width: 250,
        sortable: false
      },
      {
        key: 'EndDate',
        title: 'Ngày hết hạn',
        dataKey: 'EndDate',
        cellRenderer: ({ rowData }) => (
          <div className='font-number'>
            {rowData.EndDate ? moment(rowData.EndDate).format('DD-MM-YYYY') : 'Chưa có'}
          </div>
        ),
        width: 200,
        sortable: false
      }
    ],
    []
  )

  return (
    <div className='flex flex-col h-full'>
      <ReactBaseTable
        fixed
        wrapClassName='grow'
        rowKey='Ids'
        columns={columns}
        data={Lists}
        rowHeight={70}
        loading={isLoading}
      />
    </div>
  )
}

const LowStockProductTab = ({ MemberID, isActive }) => {
  const [filters] = useState({
    filter: {
      MemberID: MemberID
    },
    pi: 1,
    ps: 20
  })

  const { data, fetchNextPage, isLoading, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['LowStockProductTab', filters],
    queryFn: async ({ pageParam = 1 }) => {
      let { data } = await TelesalesAPI.getListProductInDate({
        ...filters,
        pi: pageParam
      })
      return data
        ? {
            ...data,
            items: data?.items ? data?.items.map((item) => ({ ...item, Ids: uniqueId() })) : []
          }
        : null
    },
    getNextPageParam: (lastPage) => (lastPage.pi === lastPage.pcount ? undefined : lastPage.pi + 1),
    enabled: isActive && MemberID > 0
  })

  const columns = useMemo(
    () => [
      {
        key: 'index',
        title: 'STT',
        dataKey: 'index',
        cellRenderer: ({ rowIndex }) => rowIndex + 1,
        width: 60,
        sortable: false,
        align: 'center'
      },
      {
        key: 'Title',
        title: 'Tên mặt hàng',
        dataKey: 'Title',
        width: 250,
        sortable: false,
        className: 'flex-fill',
        headerClassName: 'flex-fill'
      },
      {
        key: 'CreateDate',
        title: 'Ngày mua hàng',
        dataKey: 'CreateDate',
        cellRenderer: ({ rowData }) => (
          <div className='font-number'>{moment(rowData.CreateDate).format('HH:mm DD-MM-YYYY')}</div>
        ),
        width: 200,
        sortable: false
      },
      {
        key: 'PriceProduct',
        title: 'Giá bán',
        dataKey: 'PriceProduct',
        cellRenderer: ({ rowData }) => (
          <div className='font-number'>{formatString.formatVND(rowData.PriceProduct)}</div>
        ),
        width: 150,
        sortable: false,
        align: 'center'
      },
      {
        key: 'DaysRemain',
        title: 'Cảnh báo (Ngày)',
        dataKey: 'DaysRemain',
        width: 180,
        cellRenderer: ({ rowData }) => <div className='font-number'>{rowData.DaysRemain}</div>,
        sortable: false,
        align: 'center'
      }
    ],
    []
  )

  const handleEndReached = () => {
    if (hasNextPage && !isLoading) {
      fetchNextPage()
    }
  }

  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? []
  }, [data])

  return (
    <div className='flex flex-col w-full h-full'>
      <ReactBaseTable
        fixed
        wrapClassName='grow'
        rowKey='Ids'
        columns={columns}
        data={items || []}
        rowHeight={70}
        loading={isLoading}
        onEndReachedThreshold={300}
        onEndReached={handleEndReached}
      />
    </div>
  )
}

const PurchaseHistoryTab = ({ MemberID, isActive }) => {
  const [filters, setFilters] = useState({
    ProdOrService: '',
    MemberID: MemberID,
    pi: 1,
    ps: 20
  })

  const { data, fetchNextPage, isLoading, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['PurchaseHistoryTab', filters],
    queryFn: async ({ pageParam = 1 }) => {
      let { data } = await TelesalesAPI.getListBuydingProduct({
        ...filters,
        pi: pageParam
      })
      return data
        ? {
            ...data,
            items: data?.items ? data?.items.map((item) => ({ ...item, Ids: uniqueId() })) : []
          }
        : null
    },
    getNextPageParam: (lastPage) => (lastPage.pi === lastPage.pcount ? undefined : lastPage.pi + 1),
    enabled: isActive && MemberID > 0
  })

  const columns = useMemo(
    () => [
      {
        key: 'index',
        title: 'STT',
        dataKey: 'index',
        cellRenderer: ({ rowIndex }) => rowIndex + 1,
        width: 60,
        sortable: false,
        align: 'center'
      },
      {
        key: 'CreateDate',
        title: 'Ngày mua hàng',
        dataKey: 'CreateDate',
        cellRenderer: ({ rowData }) => (
          <div className='font-number'>{moment(rowData.CreateDate).format('HH:mm DD-MM-YYYY')}</div>
        ),
        width: 200,
        sortable: false
      },
      {
        key: 'Title',
        title: 'Tên mặt hàng',
        dataKey: 'Title',
        width: 350,
        sortable: false,
        className: 'flex-fill',
        headerClassName: 'flex-fill',
        headerRenderer: ({ column }) => {
          return (
            <div className='flex items-center justify-between w-full'>
              <div className='uppercase text-[13px]'>{column.title}</div>
              <div>
                <select
                  className='border text-[13px] py-2 px-3 rounded'
                  onChange={(e) => {
                    setFilters((prevState) => ({
                      ...prevState,
                      ProdOrService: e.target.value
                    }))
                  }}
                >
                  <option value=''>Tất cả</option>
                  <option value='0'>Sản phẩm</option>
                  <option value='1'>Dịch vụ</option>
                  <option value='2'>Phụ phí</option>
                  <option value='3'>Nguyên vật liệu</option>
                  <option value='4'>Thẻ tiền</option>
                </select>
              </div>
            </div>
          )
        }
      },
      {
        key: 'Qty',
        title: 'Số lượng',
        dataKey: 'Qty',
        width: 100,
        sortable: false,
        align: 'center'
      }
    ],
    []
  )

  const handleEndReached = () => {
    if (hasNextPage && !isLoading) {
      fetchNextPage()
    }
  }

  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? []
  }, [data])

  return (
    <div className='flex flex-col w-full h-full'>
      <ReactBaseTable
        fixed
        wrapClassName='grow'
        rowKey='Ids'
        columns={columns}
        data={items || []}
        rowHeight={70}
        loading={isLoading || isFetching}
        onEndReachedThreshold={300}
        onEndReached={handleEndReached}
      />
    </div>
  )
}

const ServiceUsageHistoryTab = ({ MemberID, isActive }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['ServiceUsageHistoryTab', MemberID],
    queryFn: async () => {
      let { data } = await TelesalesAPI.getHisUseServices(MemberID)
      let newRs = []

      for (let item of data) {
        for (let service of item.Services) {
          if (service.Status === 'done') {
            newRs.push({
              ...service,
              ProdTitle: item.OrderItem.ProdTitle
            })
          }
        }
      }

      newRs = formatArray.groupByDate(newRs, 'BookDate')

      const newData = []
      for (let [index, item] of newRs.entries()) {
        for (let [k, o] of item.items.entries()) {
          const newObj = {
            ...o,
            ...item,
            index: index,
            Ids: uniqueId()
          }
          if (k !== 0) {
            delete newObj.items
          }
          newData.push(newObj)
        }
      }
      return newData
    },
    enabled: isActive && MemberID > 0
  })

  const columns = useMemo(
    () => [
      {
        key: 'index',
        title: 'STT',
        dataKey: 'index',
        cellRenderer: ({ rowData }) => rowData.index + 1,
        rowSpan: ({ rowData }) => (rowData.items && rowData.items.length > 0 ? rowData.items.length : 1),
        width: 60,
        sortable: false,
        align: 'center'
      },
      {
        key: 'dayFull',
        title: 'Ngày sử dụng',
        dataKey: 'dayFull',
        cellRenderer: ({ rowData }) => moment(rowData.dayFull).format('HH:mm DD-MM-YYYY'),
        rowSpan: ({ rowData }) => (rowData.items && rowData.items.length > 0 ? rowData.items.length : 1),
        width: 200,
        sortable: false
      },
      {
        key: 'Title',
        title: 'Tên dịch vụ',
        dataKey: 'Title',
        width: 250,
        cellRenderer: ({ rowData }) => (
          <Text tooltipMaxWidth={250}>
            {rowData.ProdTitle} ({rowData.ProdService2 || rowData.Title})
          </Text>
        ),
        sortable: false,
        className: 'flex-fill',
        headerClassName: 'flex-fill'
      },
      {
        key: 'Nhân viên thực hiện',
        title: 'Nhân viên thực hiện',
        dataKey: 'Qty',
        width: 200,
        cellRenderer: ({ rowData }) => (
          <Text tooltipMaxWidth={250}>
            {rowData.Staffs && rowData.Staffs.map((staff) => staff.FullName).join(', ')}
          </Text>
        ),
        sortable: false
      }
    ],
    []
  )

  const rowRenderer = ({ rowData, rowIndex, cells, columns, isScrolling }) => {
    const indexList = [0, 1]
    if (rowData.rowSpanIndex > 0) {
      indexList.forEach((i) => {
        const cell = cells[i]

        // replace nội dung cell bằng rỗng
        cells[i] = React.cloneElement(cell, {
          children: null,
          border: 'none'
        })
      })
    }
    for (let index of indexList) {
      const rowSpan = columns[index].rowSpan({ rowData, rowIndex })
      if (rowSpan > 1) {
        const cell = cells[index]
        const style = {
          ...cell.props.style,
          backgroundColor: '#fff',
          height: rowSpan * 50 - 1,
          alignSelf: 'flex-start',
          zIndex: 1
        }
        cells[index] = React.cloneElement(cell, { style })
      }
    }
    return cells
  }

  return (
    <div className='flex flex-col w-full h-full'>
      <ReactBaseTable
        wrapClassName='grow'
        rowKey='Ids'
        columns={columns}
        data={data || []}
        loading={isLoading}
        rowHeight={50}
        overscanRowCount={4}
        useIsScrolling
        rowRenderer={rowRenderer}
      />
    </div>
  )
}

export default PickerViews
