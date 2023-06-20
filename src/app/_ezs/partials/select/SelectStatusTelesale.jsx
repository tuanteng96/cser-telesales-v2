import React from 'react'
import Select from 'react-select'
import ConfigAPI from '../../api/config.api'
import { useQuery } from 'react-query'

function SelectStatusTelesale({ value, isMulti, loading, disabled, ...props }) {
  const { data, isLoading } = useQuery({
    queryKey: ['StatusTelesale'],
    queryFn: async () => {
      const { data } = await ConfigAPI.getName('ttpage')
      let resultChildren = []
      let resultList = []
      if (data && data.data) {
        let values = JSON.parse(data.data[0].Value)
        resultChildren = values.map((x) => ({
          label: x.Title,
          options: x.Children
            ? x.Children.map((x) => {
                let newObj = {
                  ...x,
                  value: x.Title,
                  label: x.Title
                }
                resultList.push(newObj)
                return newObj
              })
            : []
        }))
      }
      return {
        nested: resultChildren || [],
        list: resultList || []
      }
    }
  })

  return (
    <>
      <Select
        isMulti={isMulti}
        isLoading={loading || isLoading}
        isDisabled={disabled || isLoading}
        menuPosition='fixed'
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999
          })
        }}
        menuPortalTarget={document.body}
        classNamePrefix='select'
        options={data?.nested || []}
        value={
          isMulti
            ? data?.list?.filter((x) => value && value.some((k) => k === x.value))
            : data?.list?.filter((x) => x.value === value)
        }
        placeholder='Chọn trạng thái'
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </>
  )
}

export { SelectStatusTelesale }
