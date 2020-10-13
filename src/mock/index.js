import Mock from 'mockjs'
import imgCode from './data/supplies/imgCode'
import login from './data/supplies/login'
import resource from './data/supplies/resource'
import weakPassword from './data/supplies/weakPassword'
import zbTree from './data/supplies/weakPassword'
import getPlanList from './data/supplies/getPlanList'
import getPurchaseList from './data/supplies/getPurchaseList'
import getSuppliesList from './data/supplies/getSuppliesList'
import getPlanDetails from './data/supplies/getPlanDetails'
import getPurchaseDetails from './data/supplies/getPurchaseDetails'
import getStorageStatisticsList from './data/supplies/getStorageStatisticsList'
import getStorageStatementList from './data/supplies/getStorageStatementList'
import getAdminData from './data/supplies/getAdminData'
import getWarehouseData from './data/supplies/getWarehouseData'

Mock.mock(/\/authServices\/users\/img-validate-code/, 'get', imgCode)
Mock.mock(/\/authServices\/rsa\/public-key/, 'get', login)
Mock.mock(/\/duty\/login/, 'post', login)
Mock.mock(/\/authServices\/resource.*/, 'get', resource)
Mock.mock(/\/authServices\/users\/weak-password/, 'post', weakPassword)
Mock.mock(/\/duty\/unit-service\/zb-tree/, 'get', zbTree)
Mock.mock(/\/duty\/unit-service\/zb-page-list/, 'get', zbTree)
Mock.mock(/\/duty\/message\/message-page/, 'get', zbTree)
Mock.mock(/\/muem\/resource\/purchase-plan-service\/list/, 'get', getPlanList) // 采购计划分页
Mock.mock(/\/muem\/resource\/purchase-service\/list/, 'get', getPurchaseList) // 采购单分页
Mock.mock(/\/getSuppliesList/, 'get', getSuppliesList)  // 物资列表
Mock.mock(/\/muem\/resource\/purchase-plan-service\/plan/, 'get', getPlanDetails) // 采购计划详情
Mock.mock(/\/muem\/resource\/purchase-service\/purchase/, 'get', getPurchaseDetails) // 采购单详情
Mock.mock(/\/muem\/resource\/storage-service\/count-page-list/, 'get', getStorageStatisticsList) // 库存统计列表
Mock.mock(/\/muem\/resource\/storage-service\/flow-page-list/, 'get', getStorageStatementList) // 库存统计列表
Mock.mock(/\/muem\/resource\/statistics-service\/organize-admin/, 'get', getAdminData) // 单位管理员-统计分析
Mock.mock(/\/muem\/resource\/statistics-service\/warehouse-admin/, 'get', getWarehouseData) // 单位管理员-统计分析
