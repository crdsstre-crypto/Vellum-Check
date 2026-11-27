src=open('/home/claude/tools/cardv2.py').read().split("if __name__")[0]
src=src[:src.index("# 52")]+src[src.index("AC={"):] if "# 52" in src else src
ns={};exec(src,ns); ns['AC']['cardtimerfile']=(102,138)
hero=('<g filter="{F}"><circle cx="75" cy="104" r="28" fill="#fff"/></g><circle cx="75" cy="104" r="28" fill="none" stroke="#3a5a9a" stroke-width="4"/><rect x="69" y="68" width="12" height="8" rx="2" fill="#3a5a9a"/><path d="M75 104v-18M75 104l12 6" stroke="#d9363e" stroke-width="3" stroke-linecap="round"/><text x="75" y="126" text-anchor="middle" font-size="8" font-weight="900" fill="#3a5a9a" font-family="sans-serif">12</text>')
acc='<g class="sc-bob"><g filter="{F}"><circle cx="102" cy="138" r="10" fill="#fff"/></g><path d="M97 141l5-8 5 8z" fill="#3aaa5a"/></g>'
open('/home/claude/work/c206.js','w').write(ns['js']('cardtimerfile','#eaf0fa','#c4d2ec','#f8faff','#3a5a9a',hero,acc)+'\n')
