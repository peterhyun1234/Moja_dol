package com.example.firebase_20190925.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.firebase_20190925.R;
import com.example.firebase_20190925.model.Test;
import com.example.firebase_20190925.model.UserModel;

import java.util.ArrayList;

public class TestAdapter  extends RecyclerView.Adapter<TestViewHolder>{
    private ArrayList<Test> tList;

    public TestAdapter(ArrayList<Test> list) {
        tList = list;
    }


    @NonNull
    @Override
    public TestViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.test_row, parent, false);
        return new TestViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull TestViewHolder holder, int position) {
        holder._title.setText(tList.get(position).getTitle());
        holder._edate.setText(tList.get(position).getApply_end());
        holder._sdate.setText(tList.get(position).getApply_start());
        holder._url.setText(tList.get(position).getUrl());
    }

    @Override
    public int getItemCount() {
        return tList.size();
    }
}
