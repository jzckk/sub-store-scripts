const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['♻️ 自动选择', '🔍 手动选择'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['🇭🇰 香港', '🇭🇰 香港自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /港|香港|🇭🇰|hongkong|kong kong|hk/i))
  }
  if (['🇺🇸 美国', '🇺🇸 美国自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /美|美国|🇺🇸|unitedstates|united states|us/i))
  }
  if (['🇸🇬 新加坡', '🇸🇬 新加坡自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:us)).*(新|新加坡|🇸🇬|singapore|sg)/i))
  }
  if (['🇰🇷 韩国', '🇰🇷 韩国自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:us)).*(韩|韩国|🇰🇷|South Korea|Korea|kr)/i))
  }
  if (['🇯🇵 日本', '🇯🇵 日本自动'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /日|日本|🇯🇵|japan|jp/i))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}
