export function safeReturnPath(value:string|null){return value&&/^\/(en|th)(\/[^\\?#]*)?$/.test(value)&&!value.includes('%')?value:'/en'}
export function displayIdentity(user:{user_metadata?:Record<string,unknown>}|null){if(!user)return '';const m=user.user_metadata||{};return String(m.user_name||m.preferred_username||m.name||m.full_name||'Member')}
