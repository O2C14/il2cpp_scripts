import re
path="dump.cs"#填入dump.cs的地址
file=open(path,'r')    #打开hea目标文件
file_contents=file.readlines()                    #按行读取全部内容

偏移列表=[]
def findsinglefunction():
    for index,value in enumerate(file_contents):     #逐行读取
        if (''in value) and '{ }'in value:#筛选函数 引号内填入可能的单词
            #print(value,end="")
            tmp=index
            while (('{' in file_contents[tmp])==1 and ('}' in file_contents[tmp])==0)==0:
                tmp-=1
            if (''in file_contents[tmp-1]):#筛选类名 引号内填入可能的单词
                print(file_contents[tmp-1],end="")
                print(value,end="")
                偏移列表.append((re.search( r'\b0x[0-9a-fA-F]+\b', file_contents[index-1], re.M|re.I)).group())
            
            #print(value,end="")

def collectoffset():
    for index,value in enumerate(file_contents):
        if ''in value:#填入类名,形如public class a:b,c
            tmp=index
            while(('}' in file_contents[tmp])==1 and ('{' in file_contents[tmp])==0)==0:
                tmp+=1
            while (('{' in file_contents[tmp])==1 and ('}' in file_contents[tmp])==0)==0:
                if 'RVA'in file_contents[tmp]:
                    偏移列表.append((re.search( r'\b0x[0-9a-fA-F]+\b', file_contents[tmp], re.M|re.I)).group())
                tmp-=1
#findsinglefunction()#选择一个函数
collectoffset()
tmpstr='['
for index in 偏移列表:#控制台输出的可以直接填入统计函数.js
    tmpstr=tmpstr+index+', '
print(tmpstr.strip(', ')+'];')
