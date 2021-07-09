.PHONY := all

start:
	uvicorn app.main:app --reload