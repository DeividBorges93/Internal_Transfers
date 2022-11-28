import React from "react"

export default function RowGenerate({ id, debitedAccountId, creditedAccountId, value, createdAt }: cahsOutOrIn) {
  return (
      <tr key={id}>
        <td>{id}</td>
        <td>{debitedAccountId}</td>
        <td>{creditedAccountId}</td>
        <td>{value}</td>
        <td>{createdAt}</td>
      </tr>
    
  )}