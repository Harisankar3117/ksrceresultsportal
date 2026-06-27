import pandas as pd
df = pd.read_excel('RESULT excel demo.xlsx')
print("Columns:")
print(list(df.columns))
print("First row:")
print(df.iloc[0].to_dict())
