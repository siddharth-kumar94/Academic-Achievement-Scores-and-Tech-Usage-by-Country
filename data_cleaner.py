
# coding: utf-8

# In[1]:

import pandas as pd
import numpy as np


# In[4]:

pisa = pd.read_csv('pisa2012.csv')


# In[5]:

pisa = pisa[['CNT', 'IC01Q01', 'IC01Q02', 'IC01Q03', 'IC01Q04', 'IC01Q07', 'IC02Q01', 'IC02Q02', 'IC02Q03', 'IC02Q04', 'PV1MATH', 'PV1READ', 'PV1SCIE']]


# In[6]:

pisa.columns = ['Country', 'Desktop - Home', 'Laptop - Home', 'Tablet - Home', 'Internet - Home', 'Cell phone with Internet', 'Desktop - School', 'Laptop - School', 'Tablet - School', 'Internet - School', 'Math Score', 'Reading Score', 'Science Score']


# In[7]:

pd.Series(pd.isnull(pisa.iloc[:, 1:10]).sum(axis=1), dtype='category').value_counts()


# In[8]:

pisa = pisa[pd.isnull(pisa.iloc[:, 1:10]).sum(axis=1) < 6]


# In[9]:

def booleanize_tech_usage(x):
    if x == 'Yes, and I use it':
        return 1
    else:
        return 0


# In[10]:

pisa.iloc[:, 1:10] = pisa.iloc[:, 1:10].applymap(booleanize_tech_usage)


# In[11]:

pisa.replace(['China-Shanghai', 'Chinese Taipei', 'Hong Kong-China', 'Macao-China'], 'China', inplace=True)
pisa.replace(['Perm(Russian Federation)', 'Russian Federation'], 'Russia', inplace=True)
pisa.replace(['Massachusetts (USA)', 'Florida (USA)', 'Connecticut (USA)', 'United States of America'], 'USA', inplace=True)
pisa.replace('Slovak Republic', 'Slovakia', inplace=True)


# In[12]:

aggregations = {
    'Desktop - Home': { 
        'Desktop - Home %': lambda x: float(sum(x)) / x.size
    },
    'Laptop - Home': {
        'Laptop - Home %': lambda x: float(sum(x)) / x.size
    },
    'Tablet - Home': {
        'Tablet - Home %': lambda x: float(sum(x)) / x.size
    },
    'Internet - Home': {
        'Internet - Home %': lambda x: float(sum(x)) / x.size
    },
    'Cell phone with Internet': {
        'Cell phone with Internet %': lambda x: float(sum(x)) / x.size
    },
    'Desktop - School': {
        'Desktop - School %': lambda x: float(sum(x)) / x.size
    },
    'Laptop - School': {
        'Laptop - School %': lambda x: float(sum(x)) / x.size
    },
    'Tablet - School': {
        'Tablet - School %': lambda x: float(sum(x)) / x.size
    },
    'Internet - School': {
        'Internet - School %': lambda x: float(sum(x)) / x.size
    },
    'Math Score': {
        'Mean: Math Score': 'mean'
    },
    'Reading Score': {
        'Mean: Reading Score': 'mean'
    },
    'Science Score': {
        'Mean: Science Score': 'mean'
    }
}


# In[50]:

pisa_grouped = pisa.groupby('Country').agg(aggregations)


# In[51]:

pisa_grouped.columns = pisa_grouped.columns.droplevel(0)


# In[52]:

pisa_grouped = pisa_grouped[['Desktop - School %', 'Desktop - Home %', 'Laptop - School %', 'Laptop - Home %', 'Tablet - School %', 'Tablet - Home %', 'Cell phone with Internet %', 'Internet - School %', 'Internet - Home %', 'Mean: Math Score', 'Mean: Science Score', 'Mean: Reading Score' ]]


# In[16]:

def normalize_mean_score(column):
    xmin = column.min()
    xmax = column.max()
    
    return (column - xmin) / (xmax - xmin)


# In[53]:

normalized_scores = pisa_grouped.iloc[:, 9:12].apply(normalize_mean_score, axis=0)


# In[57]:

normalized_scores.columns = ['Norm Math', 'Norm Science', 'Norm Reading']


# In[70]:

pisa_grouped = pisa_grouped.join(normalized_scores)


# In[76]:

pisa_grouped.to_csv('pisa_data.csv')

