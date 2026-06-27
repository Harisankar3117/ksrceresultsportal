import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error
import pandas as pd
import math

load_dotenv()
def create_db_and_insert_data():
    try:
        # Connect to MySQL server
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', '')
        )
        if connection.is_connected():
            cursor = connection.cursor()
            # Create database
            cursor.execute("CREATE DATABASE IF NOT EXISTS cllege_results")
            print("Database cllege_results created/exists.")
            
            # Use database
            cursor.execute("USE cllege_results")
            
            # Create table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS results (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    register_no VARCHAR(50),
                    student_name VARCHAR(255),
                    semester VARCHAR(50),
                    subject_code VARCHAR(50),
                    subject_name VARCHAR(255),
                    grade VARCHAR(10),
                    result_status VARCHAR(10)
                )
            """)
            print("Table results created/exists.")
            
            # Clear existing data to avoid duplicates on re-runs
            cursor.execute("DROP TABLE IF EXISTS results")
            cursor.execute("""
                CREATE TABLE results (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    register_no VARCHAR(50),
                    student_name VARCHAR(255),
                    semester VARCHAR(50),
                    subject_code VARCHAR(50),
                    subject_name VARCHAR(255),
                    grade VARCHAR(10),
                    result_status VARCHAR(10)
                )
            """)
            
            # Read Excel file
            df = pd.read_excel('RESULT excel demo 2.xlsx')
            
            # Replace NaN with None for MySQL
            df = df.where(pd.notnull(df), None)
            
            # Insert data
            insert_query = """
                INSERT INTO results (register_no, student_name, semester, subject_code, subject_name, grade, result_status)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            
            count = 0
            for index, row in df.iterrows():
                # Convert numeric register_no to string
                reg_no = str(row.get('register_no')) if pd.notna(row.get('register_no')) else None
                s_name = str(row.get('student_name')) if pd.notna(row.get('student_name')) else None
                
                # Handle typo in excel column 'semseter'
                if pd.notna(row.get('semester')):
                    sem = str(row.get('semester'))
                elif pd.notna(row.get('semseter')):
                    sem = str(row.get('semseter'))
                else:
                    sem = None
                    
                sub_code = str(row.get('subject_code')) if pd.notna(row.get('subject_code')) else None
                sub_name = str(row.get('subject_name')) if pd.notna(row.get('subject_name')) else None
                grade = str(row.get('grade')) if pd.notna(row.get('grade')) else None
                res = str(row.get('Result')) if pd.notna(row.get('Result')) else None
                
                if reg_no is not None:
                    cursor.execute(insert_query, (reg_no, s_name, sem, sub_code, sub_name, grade, res))
                    count += 1
            
            connection.commit()
            print(f"Data ingestion complete. Inserted {count} records.")

    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed.")

if __name__ == "__main__":
    create_db_and_insert_data()
